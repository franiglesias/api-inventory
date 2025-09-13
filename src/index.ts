import express from "express"

import dotenv from "dotenv"

import inventoryRouter from "./driving/router/router"
import { MessageBus } from "./lib/message-bus"
import { GetHealth } from "./inventory/driving/forCheckingHealth/GetHealth"
import { GetHealthHandler } from "./inventory/driving/forCheckingHealth/GetHealthHandler"
import { MessageBusAdapter } from "./driven/forDispatchingMessages/MessageBusAdapter"
import { ForCheckingHealthApiAdapter } from "./driving/forCheckingHealth/ApiAdapter"
import { ForGettingProductsApiAdapter } from "./driving/forGettingProducts/ApiAdapter"
import { GetProducts } from "./inventory/driving/forGettingProducts/GetProducts"
import { GetProductsHandler } from "./inventory/driving/forGettingProducts/GetProductsHandler"
import { ForStoringProductsMemoryAdapter } from "./driven/forStoringProducts/MemoryAdapter"
import { RegisterProduct } from "./inventory/driving/forRegisteringProducts/RegisterProduct"
import { RegisterProductHandler } from "./inventory/driving/forRegisteringProducts/RegisterProductHandler"
import { ForRegisterProductsApiAdapter } from "./driving/forRegisterProducts/ApiAdapter"
import { ForUpdatingStockApiAdapter } from "./driving/forUpdatingStock/ApiAdapter"
import { AddUnits } from "./inventory/driving/forUpdatingStock/AddUnits"
import { AddUnitsHandler } from "./inventory/driving/forUpdatingStock/AddUnitsHandler"
import { RemoveUnits } from "./inventory/driving/forUpdatingStock/RemoveUnits"
import { RemoveUnitsHandler } from "./inventory/driving/forUpdatingStock/RemoveUnitsHandler"
import { readProductsFromFile } from "./lib/read-products"

dotenv.config()

function buildApplication(): MessageBusAdapter {
  const forStoringProducts = new ForStoringProductsMemoryAdapter(readProductsFromFile())

  const messageBus = new MessageBus()
  messageBus.register(GetHealth, new GetHealthHandler())
  messageBus.register(GetProducts, new GetProductsHandler(forStoringProducts))
  messageBus.register(RegisterProduct, new RegisterProductHandler(forStoringProducts))
  messageBus.register(AddUnits, new AddUnitsHandler(forStoringProducts))
  messageBus.register(RemoveUnits, new RemoveUnitsHandler(forStoringProducts))
  return new MessageBusAdapter(messageBus)
}

const forDispatching = buildApplication()

const forUpdatingStock = new ForUpdatingStockApiAdapter(forDispatching)
inventoryRouter.post("/products/:sku/add", forUpdatingStock.postAddUnits.bind(forUpdatingStock))
inventoryRouter.post(
  "/products/:sku/remove",
  forUpdatingStock.postRemoveUnits.bind(forUpdatingStock),
)

const forRegisteringProducts = new ForRegisterProductsApiAdapter(forDispatching)
inventoryRouter.post("/products", forRegisteringProducts.postProducts.bind(forRegisteringProducts))

const forGettingProducts = new ForGettingProductsApiAdapter(forDispatching)
inventoryRouter.get("/products", forGettingProducts.getProducts.bind(forGettingProducts))

const forCheckingHealth = new ForCheckingHealthApiAdapter(forDispatching)
inventoryRouter.get("/health", forCheckingHealth.getHealth.bind(forCheckingHealth))

inventoryRouter.get("/", (request, response) => response.status(200).send("Hello World"))

const app = express()

// Parse JSON request bodies
app.use(express.json())

const PORT = process.env.PORT

app.use("/", inventoryRouter)

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT)
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message)
  })
