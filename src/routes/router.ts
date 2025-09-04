import { Router } from 'express'
import HealthController from '../controllers/HealthController'
import HomeController from "../controllers/HomeController";
import { join } from 'node:path'

const router = Router()
const healthController = new HealthController()
const homeController = new HomeController()

router.get('/health', healthController.handle.bind(healthController))
router.get('/', homeController.handle.bind(homeController))

// Serve OpenAPI spec (YAML)
router.get('/openapi.yaml', (_req, res) => {
  const filePath = join(process.cwd(), 'openapi', 'openapi.yaml')
  res.sendFile(filePath)
})

export default router
