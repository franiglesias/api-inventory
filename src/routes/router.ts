import { Router } from 'express'
import HealthController from '../controllers/HealthController.ts'

const router = Router()
const healthController = new HealthController()

router.get('/health', healthController.handle.bind(healthController))

export default router
