import Database from 'better-sqlite3'
import { StoredProduct } from '../../inventory/driven/forStoringProducts/ForStoringProducts'
import path from 'path'
import fs from 'fs'

export class InventoryDatabase {
  private readonly db: Database.Database

  private constructor(db: Database.Database) {
    this.db = db
  }

  static init(dbFilePath: string, seed: StoredProduct[] = []): InventoryDatabase {
    const absPath = path.isAbsolute(dbFilePath) ? dbFilePath : path.join(process.cwd(), dbFilePath)
    // Ensure directory exists
    const dir = path.dirname(absPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    const db = new Database(absPath)

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

    // When running tests with sqlite, keep all changes inside a single transaction
    // so the database stays clean after the test process exits.
    if (process.env.NODE_ENV === 'test') {
      try {
        // Start a long-lived transaction. Any nested transactions will use SAVEPOINTs.
        db.exec('BEGIN IMMEDIATE')
        // Roll back all changes when the process exits.
        process.once('exit', () => {
          try {
            db.exec('ROLLBACK')
          } catch (_) {
            // ignore if already closed or rolled back
          }
        })
        // Also handle common termination signals during local runs
        for (const sig of ['SIGINT', 'SIGTERM']) {
          process.once(sig as NodeJS.Signals, () => {
            try {
              db.exec('ROLLBACK')
            } catch (_) {}
            process.exit(0)
          })
        }
      } catch (e) {
        // If BEGIN fails, continue without the global test transaction
      }
    }

    const inventory = new InventoryDatabase(db)
    if (seed && seed.length > 0) {
      inventory.seed(seed)
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

  prepare(query: string): any {
    return this.db.prepare(query)
  }
}
