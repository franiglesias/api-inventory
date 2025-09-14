import { afterEach, beforeAll, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'

declare global {
  // eslint-disable-next-line no-var
  var __inventoryDb: { beginTestCase: () => void; rollbackTestCase: () => void } | undefined
}

// Ensure a clean SQLite DB file before the test run starts
beforeAll(() => {
  try {
    // Default test DB path as defined in .env.test
    const dbPath =
      process.env.SQLITE_DB_PATH || path.join(process.cwd(), './data/inventory.test.db')
    const abs = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath)
    if (fs.existsSync(abs)) {
      fs.rmSync(abs, { force: true })
    }
  } catch (_) {
    // ignore cleanup issues
  }
})

beforeEach(() => {
  try {
    globalThis.__inventoryDb?.beginTestCase()
  } catch (_) {
    // ignore
  }
})

afterEach(() => {
  try {
    globalThis.__inventoryDb?.rollbackTestCase()
  } catch (_) {
    // ignore
  }
})
