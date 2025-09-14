import { MessageBus } from '../lib/message-bus'
import { GetHealth } from '../inventory/driving/forCheckingHealth/GetHealth'
import { GetHealthHandler } from '../inventory/driving/forCheckingHealth/GetHealthHandler'
import { MessageBusAdapter } from '../driven/forDispatchingMessages/MessageBusAdapter'
import { GetProducts } from '../inventory/driving/forGettingProducts/GetProducts'
import { GetProductsHandler } from '../inventory/driving/forGettingProducts/GetProductsHandler'
import { RegisterProduct } from '../inventory/driving/forRegisteringProducts/RegisterProduct'
import { RegisterProductHandler } from '../inventory/driving/forRegisteringProducts/RegisterProductHandler'
import { AddUnits } from '../inventory/driving/forUpdatingStock/AddUnits'
import { AddUnitsHandler } from '../inventory/driving/forUpdatingStock/AddUnitsHandler'
import { RemoveUnits } from '../inventory/driving/forUpdatingStock/RemoveUnits'
import { RemoveUnitsHandler } from '../inventory/driving/forUpdatingStock/RemoveUnitsHandler'
import { ForGettingTimeSystemAdapter } from '../driven/forGettingTime/SystemAdapter'
import { ForStoringProductsFactory } from '../driven/forStoringProducts/ForStoringProductsFactory'

export function buildApplication(): MessageBusAdapter {
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
