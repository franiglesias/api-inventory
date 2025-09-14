import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import {
  ForStoringProducts,
  StoredProduct,
} from '../../inventory/driven/forStoringProducts/ForStoringProducts'

export class ForStoringProductsSqliteAdapter implements ForStoringProducts {
  private readonly db: Database.Database

  constructor(dbFilePath: string, seed: StoredProduct[] = []) {
    const absPath = path.isAbsolute(dbFilePath) ? dbFilePath : path.join(process.cwd(), dbFilePath)
    // Ensure directory exists
    const dir = path.dirname(absPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    this.db = new Database(absPath)
    this.init()
    this.seedIfEmpty(seed)
  }

  retrieveBySku(sku: string): StoredProduct | undefined {
    const row = this.db.prepare('SELECT * FROM products WHERE sku = ?').get(sku) as StoredProduct
    if (!row) return undefined
    return {
      id: String(row.id),
      name: String(row.name),
      description: String(row.description),
      sku: String(row.sku),
      imageUrl:
        row.imageUrl !== null && row.imageUrl !== undefined ? String(row.imageUrl) : undefined,
      stock: Number(row.stock),
      minStock: Number(row.minStock),
      createdAt: new Date(String(row.createdAt)),
      updatedAt: row.updatedAt ? new Date(String(row.updatedAt)) : undefined,
    } as StoredProduct
  }

  private init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS products
      (
        id
        TEXT
        PRIMARY
        KEY,
        name
        TEXT
        NOT
        NULL,
        description
        TEXT
        NOT
        NULL,
        sku
        TEXT
        NOT
        NULL
        UNIQUE,
        imageUrl
        TEXT,
        stock
        INTEGER
        NOT
        NULL,
        minStock
        INTEGER
        NOT
        NULL,
        createdAt
        TEXT
        NOT
        NULL,
        updatedAt
        TEXT
      );
    `)
  }

  private seedIfEmpty(seed: StoredProduct[]) {
    const count = this.db.prepare('SELECT COUNT(1) as c FROM products').get() as any
    if ((count?.c ?? 0) > 0) return
    if (!seed || seed.length === 0) return
    const insert = this.db.prepare(`
      INSERT INTO products (id, name, description, sku, imageUrl, stock, minStock, createdAt, updatedAt)
      VALUES (@id, @name, @description, @sku, @imageUrl, @stock, @minStock, @createdAt, @updatedAt)
    `)
    const tx = this.db.transaction((rows: StoredProduct[]) => {
      for (const r of rows) {
        insert.run({
          id: r.id,
          name: r.name,
          description: r.description,
          sku: r.sku,
          imageUrl: r.imageUrl ?? null,
          stock: r.stock,
          minStock: r.minStock,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
        })
      }
    })
    tx(seed)
  }

  store(productToStore: StoredProduct): void {
    const upsert = this.db.prepare(`
      INSERT INTO products (id, name, description, sku, imageUrl, stock, minStock, createdAt, updatedAt)
      VALUES (@id, @name, @description, @sku, @imageUrl, @stock, @minStock, @createdAt, @updatedAt) ON CONFLICT(id) DO
      UPDATE SET
        name=excluded.name,
        description=excluded.description,
        sku=excluded.sku,
        imageUrl=excluded.imageUrl,
        stock=excluded.stock,
        minStock=excluded.minStock,
        createdAt=excluded.createdAt,
        updatedAt=excluded.updatedAt
    `)
    upsert.run({
      id: productToStore.id,
      name: productToStore.name,
      description: productToStore.description,
      sku: productToStore.sku,
      imageUrl: productToStore.imageUrl ?? null,
      stock: productToStore.stock,
      minStock: productToStore.minStock,
      createdAt: productToStore.createdAt.toISOString(),
      updatedAt: productToStore.updatedAt ? productToStore.updatedAt.toISOString() : null,
    })
  }

  retrieveAll(): StoredProduct[] {
    const rows = this.db.prepare('SELECT * FROM products').all() as any[]
    return rows.map(
      (r) =>
        ({
          id: String(r.id),
          name: String(r.name),
          description: String(r.description),
          sku: String(r.sku),
          imageUrl:
            r.imageUrl !== null && r.imageUrl !== undefined ? String(r.imageUrl) : undefined,
          stock: Number(r.stock),
          minStock: Number(r.minStock),
          createdAt: new Date(String(r.createdAt)),
          updatedAt: r.updatedAt ? new Date(String(r.updatedAt)) : undefined,
        }) as StoredProduct,
    )
  }
}
