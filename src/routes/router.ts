import { Router } from 'express'
import HealthController from '../controllers/HealthController'
import HomeController from "../controllers/HomeController";

const router = Router()
const healthController = new HealthController()
const homeController = new HomeController()

router.get('/health', healthController.handle.bind(healthController))
router.get('/', homeController.handle.bind(homeController))

export default router
