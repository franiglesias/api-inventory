import express from 'express'
import cors from 'cors'

export function createApp(inventoryRouter: ReturnType<typeof express.Router>) {
  const app = express()

  // Parse JSON request bodies
  app.use(express.json())

  // Enable CORS for all routes (simple default for frontend development)
  app.use(cors())
  app.options(/.*/, cors())

  app.use('/', inventoryRouter)

  return app
}
