import Database from 'better-sqlite3'
import { StoredProduct } from '../../../inventory/driven/forStoringProducts/ForStoringProducts'
import path from 'path'
import fs from 'fs'

export class InventoryDatabase {
  private readonly db: Database.Database
  private currentSavepoint?: string | undefined

  private constructor(db: Database.Database) {
    this.db = db
  }

  static init(dbFilePath: string, seed: StoredProduct[] = []): InventoryDatabase {
    const absPath = path.isAbsolute(dbFilePath) ? dbFilePath : path.join(process.cwd(), dbFilePath)
    // Ensure directory exists
    const dir = path.dirname(absPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    const db = new Database(absPath)

    // Improve write visibility and concurrency for tests and E2E
    try {
      db.pragma('journal_mode = WAL')
      db.pragma('synchronous = NORMAL')
      db.pragma('busy_timeout = 2000')
    } catch (_) {
      // ignore pragma errors
    }

    // Create schema if needed
    db.exec(`
      CREATE TABLE IF NOT EXISTS products
      (
        id          TEXT PRIMARY KEY,
        name        TEXT    NOT NULL,
        description TEXT    NOT NULL,
        sku         TEXT    NOT NULL UNIQUE,
        imageUrl    TEXT,
        stock       INTEGER NOT NULL,
        minStock    INTEGER NOT NULL,
        createdAt   TEXT    NOT NULL,
        updatedAt   TEXT
      );
    `)

    const inventory = new InventoryDatabase(db)
    if (seed && seed.length > 0) {
      inventory.seed(seed)
    }

    // Expose for tests so each test can run within its own transaction
    if (process.env.NODE_ENV === 'test') {
      ;(globalThis as any).__inventoryDb = inventory
    }

    return inventory
  }

  private seed(seed: StoredProduct[]) {
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

  // Begin a transaction scope for a single test using SAVEPOINT
  beginTestCase() {
    try {
      const name = 'vitest_case'
      this.db.exec(`SAVEPOINT ${name}`)
      this.currentSavepoint = name
    } catch (_) {
      // ignore
    }
  }

  // Rollback the transaction scope for a single test
  rollbackTestCase() {
    if (!this.currentSavepoint) return
    const name = this.currentSavepoint
    try {
      this.db.exec(`ROLLBACK TO SAVEPOINT ${name}`)
    } catch (_) {
    } finally {
      try {
        this.db.exec(`RELEASE SAVEPOINT ${name}`)
      } catch (_) {}
      this.currentSavepoint = undefined
    }
  }

  prepare(query: string): any {
    return this.db.prepare(query)
  }
}
