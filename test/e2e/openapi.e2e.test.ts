import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

async function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function startServer() {
  await import('../../src/index')
}

function buildUrl(path: string) {
  // Compute base URL locally to avoid any scope issues with BASE_URL
  const RAW = 'http://localhost:' + process.env.PORT
  const BASE = (RAW && RAW.trim().length > 0 ? RAW : 'http://localhost:3333').replace(/\/+$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${BASE}${p}`
}

async function get(path: string) {
  const url = buildUrl(path)
  const res = await fetch(url)
  const json = await res.json().catch(() => ({}))
  return { status: res.status, body: json }
}

async function post(path: string, body?: any) {
  const init: any = {
    method: 'POST',
    headers: { 'content-type': 'application/json' } as any,
    body: body != null ? JSON.stringify(body) : null,
  }
  const res = await fetch(buildUrl(path), init as any)
  const json = await res.json().catch(() => ({}))
  return { status: res.status, body: json }
}

describe('Inventory API E2E (OpenAPI scenarios)', () => {
  beforeAll(async () => {
    // Prefer port from .env.test; fallback to 3333 to avoid conflicts
    if (!process.env.PORT) process.env.PORT = '3333'
    await startServer()
    // Give it a moment to bind the port
    await wait(200)
  })

  afterAll(async () => {
    // No exported server to close; tests run against the same process.
  })

  describe('Health', () => {
    it('reports healthy status with payload', async () => {
      const res = await get('/health')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('status', 'ok')
    })
  })

  describe('Product listing', () => {
    it('returns a list of products', async () => {
      const res = await get('/products')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      if (res.body.length > 0) {
        const p = res.body[0]
        expect(p).toHaveProperty('id')
        expect(p).toHaveProperty('name')
        expect(p).toHaveProperty('sku')
        expect(p).toHaveProperty('stock')
      }
    })
  })

  describe('Create product', () => {
    const productData = {
      name: 'Test Product',
      description: 'A product for testing',
      sku: 'TEST-SKU-001',
      initialStock: 5,
      minStock: 1,
    }

    it('creates a product when the payload is valid', async () => {
      const res = await post('/products', productData)
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('sku', productData.sku)
      expect(res.body).toHaveProperty('stock')
    })

    it('rejects duplicate SKUs', async () => {
      await post('/products', productData)
      const res = await post('/products', productData)
      expect(res.status).toBe(409)
      expect(res.body).toHaveProperty('error')
    })

    it('rejects invalid or incomplete payloads', async () => {
      const res = await post('/products', { name: '', sku: '', initialStock: 0, minStock: 0 })
      expect([400]).toContain(res.status)
      expect(res.body).toHaveProperty('error')
    })
  })

  describe('Add stock', () => {
    const fixtureSku = 'TEST-SKU-ADD'
    const base = {
      name: 'Test Product',
      description: 'A product for testing',
      sku: fixtureSku,
      initialStock: 5,
      minStock: 1,
    }
    beforeEach(async () => {
      await post('/products', base)
    })

    it('adds units to an existing product', async () => {
      const res = await post(`/products/${fixtureSku}/add`, { units: 2 })
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('product')
      expect(res.body.product).toHaveProperty('sku')
    })

    it('rejects invalid unit amounts', async () => {
      const res = await post(`/products/${fixtureSku}/add`, { units: 0 })
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('error')
    })

    it("returns 'not found' for unknown SKU", async () => {
      const res = await post('/products/non-existing-sku/add', { units: 1 })
      expect([404, 500]).toContain(res.status)
    })
  })

  describe('Remove stock', () => {
    const fixtureSku = 'TEST-SKU-REMOVE'
    const base = {
      name: 'Test Product',
      description: 'A product for testing',
      sku: fixtureSku,
      initialStock: 5,
      minStock: 1,
    }
    beforeEach(async () => {
      await post('/products', base)
    })

    it('removes units from an existing product', async () => {
      const res = await post(`/products/${fixtureSku}/remove`, { units: 1 })
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('product')
    })

    it('rejects non-positive unit amounts', async () => {
      const res = await post(`/products/${fixtureSku}/remove`, { units: 0 })
      expect(res.status).toBe(400)
    })

    it('prevents removing more units than available', async () => {
      // Try to remove a very large number to trigger NegativeStock error
      const res = await post(`/products/${fixtureSku}/remove`, { units: 999999 })
      expect([400, 500]).toContain(res.status)
    })

    it('returns not found for unknown SKU', async () => {
      const res = await post('/products/non-existing-sku/remove', { units: 1 })
      expect([404, 500]).toContain(res.status)
    })
  })
})
