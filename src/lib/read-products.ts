import fs from 'fs'
import path from 'path'
import { StoredProduct } from '../inventory/driven/forStoringProducts/ForStoringProducts'
import { v4 } from 'uuid'

export function readProductsFromFile(filePathRelative: string): StoredProduct[] {
  const absolutePath = path.isAbsolute(filePathRelative)
    ? filePathRelative
    : path.join(process.cwd(), filePathRelative)
  try {
    console.log('[INIT] Reading products from file:', absolutePath)
    const raw = fs.readFileSync(absolutePath, { encoding: 'utf-8' })
    const parsed = JSON.parse(raw) as any[]
    console.log(`[INIT] Found ${parsed.length} products to import.`)
    if (!Array.isArray(parsed)) return []
    return parsed.map((p) => ({
      id: String(v4()),
      name: String(p.name),
      description: String(p.description),
      sku: String(p.sku),
      imageUrl: p.imageUrl !== undefined ? String(p.imageUrl) : undefined,
      stock: Number(p.stock),
      minStock: Number(p.minStock),
      createdAt: new Date(p.createdAt),
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : undefined,
    })) as StoredProduct[]
  } catch (e) {
    // On any error (file not found, parse error), fallback to empty list
    console.log(`[INIT] Nothig to import.`)
    return []
  }
}
