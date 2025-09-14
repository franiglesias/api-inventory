import express from 'express'
import { ForUpdatingStockApiAdapter } from '../forUpdatingStock/ApiAdapter'
import { ForRegisterProductsApiAdapter } from '../forRegisterProducts/ApiAdapter'
import { ForGettingProductsApiAdapter } from '../forGettingProducts/ApiAdapter'
import { ForCheckingHealthApiAdapter } from '../forCheckingHealth/ApiAdapter'
import { MessageBusAdapter } from '../../driven/forDispatchingMessages/MessageBusAdapter'

export function createInventoryRouter(forDispatching: MessageBusAdapter) {
  const router = express.Router()

  const forUpdatingStock = new ForUpdatingStockApiAdapter(forDispatching)
  router.post('/products/:sku/add', forUpdatingStock.postAddUnits.bind(forUpdatingStock))
  router.post('/products/:sku/remove', forUpdatingStock.postRemoveUnits.bind(forUpdatingStock))

  const forRegisteringProducts = new ForRegisterProductsApiAdapter(forDispatching)
  router.post('/products', forRegisteringProducts.postProducts.bind(forRegisteringProducts))

  const forGettingProducts = new ForGettingProductsApiAdapter(forDispatching)
  router.get('/products', forGettingProducts.getProducts.bind(forGettingProducts))

  const forCheckingHealth = new ForCheckingHealthApiAdapter(forDispatching)
  router.get('/health', forCheckingHealth.getHealth.bind(forCheckingHealth))

  router.get('/', (_request, response) => response.status(200).send('Hello World'))

  return router
}
