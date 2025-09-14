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
import { RegisterProduct } from './inventory/driving/forRegisteringProducts/RegisterProduct'
import { RegisterProductHandler } from './inventory/driving/forRegisteringProducts/RegisterProductHandler'
import { ForRegisterProductsApiAdapter } from './driving/forRegisterProducts/ApiAdapter'
import { ForUpdatingStockApiAdapter } from './driving/forUpdatingStock/ApiAdapter'
import { AddUnits } from './inventory/driving/forUpdatingStock/AddUnits'
import { AddUnitsHandler } from './inventory/driving/forUpdatingStock/AddUnitsHandler'
import { RemoveUnits } from './inventory/driving/forUpdatingStock/RemoveUnits'
import { RemoveUnitsHandler } from './inventory/driving/forUpdatingStock/RemoveUnitsHandler'
import { ForGettingTimeSystemAdapter } from './driven/forGettingTime/SystemAdapter'
import { ForStoringProductsFactory } from './driven/forStoringProducts/ForStoringProductsFactory'

function buildApplication(): MessageBusAdapter {
  const forStoringProducts = new ForStoringProductsFactory()
    .withSqlitePath(process.env.SQLITE_DB_PATH || './data/inventory.db')
    .withFileSeed(process.env.INITIAL_DATA ?? 'data/products.json')
    .create((process.env.STORAGE_ADAPTER || 'memory').toLowerCase())
  const forGettingTime = new ForGettingTimeSystemAdapter()

  const messageBus = new MessageBus()

  messageBus.register(GetHealth, new GetHealthHandler())
  messageBus.register(GetProducts, new GetProductsHandler(forStoringProducts))
  messageBus.register(RegisterProduct, new RegisterProductHandler(forStoringProducts))
  messageBus.register(AddUnits, new AddUnitsHandler(forStoringProducts, forGettingTime))
  messageBus.register(RemoveUnits, new RemoveUnitsHandler(forStoringProducts, forGettingTime))
  return new MessageBusAdapter(messageBus)
}

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'

dotenv.config({ path: envFile })

const PORT = process.env.PORT || process.env.NODE_ENV == 'test' ? '3333' : '3000' // Sensible default for local development

const forDispatching = buildApplication()
const forUpdatingStock = new ForUpdatingStockApiAdapter(forDispatching)

const inventoryRouter = express.Router()
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
app.options(/.*/, cors())

app.use('/', inventoryRouter)

// Avoid starting multiple servers when tests import this module repeatedly
declare global {
  // eslint-disable-next-line no-var
  var __inventoryServer: import('http').Server | undefined
}

function startServer() {
  if (globalThis.__inventoryServer) return globalThis.__inventoryServer
  const server = app.listen(PORT, () => {
    console.log('[SERVER] Environment ............:', process.env.NODE_ENV)
    console.log('[SERVER] Server running at PORT .:', PORT)
    console.log('[SERVER] Storage engine .........:', process.env.STORAGE_ADAPTER)
  })
  server.on('error', (error: any) => {
    if ((error as any)?.code === 'EADDRINUSE') {
      console.warn(`[SERVER] Port ${PORT} in use, assuming server is already running.`)
      // do not throw here to avoid unhandled errors in tests
    } else {
      console.warn(`[SERVER] An error occurred while starting the server: ${error.message}`)
      throw error
    }
  })
  globalThis.__inventoryServer = server
  return server
}

startServer()

export { app }
