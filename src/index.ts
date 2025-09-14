import express from 'express'
import cors from 'cors'

import dotenv from 'dotenv'

import { MessageBus } from './lib/message-bus'
import { GetHealth } from './inventory/driving/forCheckingHealth/GetHealth'
import { GetHealthHandler } from './inventory/driving/forCheckingHealth/GetHealthHandler'
import { MessageBusAdapter } from './driven/forDispatchingMessages/MessageBusAdapter'
import { ForCheckingHealthApiAdapter } from './driving/forCheckingHealth/ApiAdapter'
import { ForGettingProductsApiAdapter } from './driving/forGettingProducts/ApiAdapter'
import { GetProducts } from './inventory/driving/forGettingProducts/GetProducts'
import { GetProductsHandler } from './inventory/driving/forGettingProducts/GetProductsHandler'
import { ForStoringProductsMemoryAdapter } from './driven/forStoringProducts/MemoryAdapter'
import { ForStoringProductsSqliteAdapter } from './driven/forStoringProducts/SqliteAdapter'
import { RegisterProduct } from './inventory/driving/forRegisteringProducts/RegisterProduct'
import { RegisterProductHandler } from './inventory/driving/forRegisteringProducts/RegisterProductHandler'
import { ForRegisterProductsApiAdapter } from './driving/forRegisterProducts/ApiAdapter'
import { ForUpdatingStockApiAdapter } from './driving/forUpdatingStock/ApiAdapter'
import { AddUnits } from './inventory/driving/forUpdatingStock/AddUnits'
import { AddUnitsHandler } from './inventory/driving/forUpdatingStock/AddUnitsHandler'
import { RemoveUnits } from './inventory/driving/forUpdatingStock/RemoveUnits'
import { RemoveUnitsHandler } from './inventory/driving/forUpdatingStock/RemoveUnitsHandler'
import { readProductsFromFile } from './lib/read-products'
import { ForGettingTimeSystemAdapter } from './driven/forGettingTime/SystemAdapter'
import Database from 'better-sqlite3'

// Load environment variables from the appropriate file.
// Vitest sets NODE_ENV to 'test' by default; ensure we read .env.test in that case.
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
dotenv.config({ path: envFile })

const inventoryRouter = express.Router()

function buildApplication(): MessageBusAdapter {
  const storageAdapter = (process.env.STORAGE_ADAPTER || 'memory').toLowerCase()
  let initialProducts = readProductsFromFile()
  let sqlitePath = process.env.SQLITE_DB_PATH || './data/inventory.db'

  let forStoringProducts: ForStoringProductsSqliteAdapter | ForStoringProductsMemoryAdapter

  if (process.env.NODE_ENV === 'test') {
    console.log('Running tests')
    initialProducts = []
    if (storageAdapter === 'sqlite') {
      console.log('Using SQLite adapter for test')
      const sqlitePath = './data/inventory.test.db'
      const db = new Database(sqlitePath)
      db.exec(`
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
        );`)
    }
  } else {
    console.log('Running development')
  }
  if (storageAdapter === 'sqlite') {
    console.log('Using SQLite adapter')
    forStoringProducts = new ForStoringProductsSqliteAdapter(sqlitePath, initialProducts)
  } else {
    console.log('Using Memory adapter')
    forStoringProducts = new ForStoringProductsMemoryAdapter(initialProducts)
  }

  const forGettingTime = new ForGettingTimeSystemAdapter()

  const messageBus = new MessageBus()
  messageBus.register(GetHealth, new GetHealthHandler())
  messageBus.register(GetProducts, new GetProductsHandler(forStoringProducts))
  messageBus.register(RegisterProduct, new RegisterProductHandler(forStoringProducts))
  messageBus.register(AddUnits, new AddUnitsHandler(forStoringProducts, forGettingTime))
  messageBus.register(RemoveUnits, new RemoveUnitsHandler(forStoringProducts, forGettingTime))
  return new MessageBusAdapter(messageBus)
}

const forDispatching = buildApplication()

const forUpdatingStock = new ForUpdatingStockApiAdapter(forDispatching)
inventoryRouter.post('/products/:sku/add', forUpdatingStock.postAddUnits.bind(forUpdatingStock))
inventoryRouter.post(
  '/products/:sku/remove',
  forUpdatingStock.postRemoveUnits.bind(forUpdatingStock),
)

const forRegisteringProducts = new ForRegisterProductsApiAdapter(forDispatching)
inventoryRouter.post('/products', forRegisteringProducts.postProducts.bind(forRegisteringProducts))

const forGettingProducts = new ForGettingProductsApiAdapter(forDispatching)
inventoryRouter.get('/products', forGettingProducts.getProducts.bind(forGettingProducts))

const forCheckingHealth = new ForCheckingHealthApiAdapter(forDispatching)
inventoryRouter.get('/health', forCheckingHealth.getHealth.bind(forCheckingHealth))

inventoryRouter.get('/', (_request, response) => response.status(200).send('Hello World'))

const app = express()
// Parse JSON request bodies
app.use(express.json())

// Enable CORS for all routes (simple default for frontend development)
app.use(cors())
// Express 5 + path-to-regexp v6 no longer accepts '*' as a route path.
// Use a catch-all pattern that matches any path for preflight requests.
app.options(/.*/, cors())

const PORT = process.env.PORT || '3000'

app.use('/', inventoryRouter)

app
  .listen(PORT, () => {
    console.log('Server running at PORT: ', PORT)
  })
  .on('error', (error) => {
    // gracefully handle error
    throw new Error(error.message)
  })
