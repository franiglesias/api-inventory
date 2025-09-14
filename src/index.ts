import { PORT } from './configurator/env'
import { buildApplication } from './configurator/buildApplication'
import { createInventoryRouter } from './driving/http/inventoryRouter'
import { createApp } from './driving/http/app'
import { startServer } from './driving/server/startServer'

const inventoryApplication = buildApplication()
const inventoryRouter = createInventoryRouter(inventoryApplication)
const app = createApp(inventoryRouter)

startServer(app, PORT)

export { app }
