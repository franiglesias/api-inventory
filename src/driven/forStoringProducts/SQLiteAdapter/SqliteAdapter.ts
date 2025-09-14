import {
  ForStoringProducts,
  StoredProduct,
} from '../../../inventory/driven/forStoringProducts/ForStoringProducts'
import { InventoryDatabase } from './InventoryDatabase'

export class ForStoringProductsSqliteAdapter implements ForStoringProducts {
  private readonly db: InventoryDatabase

  constructor(db: InventoryDatabase) {
    this.db = db
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
