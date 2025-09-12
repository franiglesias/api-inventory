import express from "express";

import dotenv from "dotenv";

import inventoryRouter from './driving/router/router'
import {MessageBus} from "./lib/message-bus";
import {GetHealth} from "./inventory/driving/forCheckingHealth/GetHealth";
import {GetHealthHandler} from "./inventory/driving/forCheckingHealth/GetHealthHandler";
import {MessageBusAdapter} from "./driven/forDispatchingMessages/MessageBusAdapter";
import {ForCheckingHealthApiAdapter} from "./driving/forCheckingHealth/ApiAdapter";
import {ForGettingProductsApiAdapter} from "./driving/forGettingProducts/ApiAdapter";
import {GetProducts} from "./inventory/driving/forGettingProducts/GetProducts";
import {GetProductsHandler} from "./inventory/driving/forGettingProducts/GetProductsHandler";
import {ForStoringProductsMemoryAdapter} from "./driven/forStoringProducts/MemoryAdapter";
import {RegisterProduct} from "./inventory/driving/forRegisteringProducts/RegisterProduct";
import {RegisterProductHandler} from "./inventory/driving/forRegisteringProducts/RegisterProductHandler";
import {ForRegisterProductsApiAdapter} from "./driving/forRegisterProducts/ApiAdapter";
import {ForUpdatingStockApiAdapter} from "./driving/forUpdatingStock/ApiAdapter";
import {AddUnits} from "./inventory/driving/forUpdatingStock/AddUnits";
import {AddUnitsHandler} from "./inventory/driving/forUpdatingStock/AddUnitsHandler";

dotenv.config();

function productFixtures() {
    return [
        {
            id: "c1a9b9d2-6f20-4e1a-9f8a-1234567890ab",
            name: "USB-C Cable",
            description: "1m braided cable",
            sku: "USBC-1M-BRAIDED",
            stock: 42,
            minStock: 5,
            createdAt: new Date("2019-08-24T14:15:22Z"),
            updatedAt: new Date("2019-08-24T14:15:22Z")
        },
        {
            id: "f67e3fe2-72b7-4faa-be3f-e272b70faa56",
            name: "Ethernet Cable",
            description: "10m braided cable",
            sku: "ETHC-10M-BRAIDED",
            stock: 30,
            minStock: 5,
            createdAt: new Date("2025-08-24T14:15:22Z"),
            updatedAt: new Date("2025-09-10T14:15:22Z")
        }
    ];
}

function buildApplication(): MessageBusAdapter {
    const forStoringProducts = new ForStoringProductsMemoryAdapter(productFixtures())

    const messageBus = new MessageBus();
    messageBus.register(GetHealth, new GetHealthHandler())
    messageBus.register(GetProducts, new GetProductsHandler(forStoringProducts))
    messageBus.register(RegisterProduct, new RegisterProductHandler(forStoringProducts))
    messageBus.register(AddUnits, new AddUnitsHandler(forStoringProducts))
    return new MessageBusAdapter(messageBus);
}

const forDispatching = buildApplication();

const forUpdatingStock = new ForUpdatingStockApiAdapter(forDispatching)
inventoryRouter.post("/products/:sku/add", forUpdatingStock.postAddUnits.bind(forUpdatingStock))

const forRegisteringProducts = new ForRegisterProductsApiAdapter(forDispatching)
inventoryRouter.post("/products", forRegisteringProducts.postProducts.bind(forRegisteringProducts))

const forGettingProducts = new ForGettingProductsApiAdapter(forDispatching)
inventoryRouter.get("/products", forGettingProducts.getProducts.bind(forGettingProducts))

const forCheckingHealth = new ForCheckingHealthApiAdapter(forDispatching)
inventoryRouter.get("/health", forCheckingHealth.getHealth.bind(forCheckingHealth))

inventoryRouter.get("/", (request, response) => response.status(200).send("Hello World"));


const app = express();

// Parse JSON request bodies
app.use(express.json());

const PORT = process.env.PORT;

app.use('/', inventoryRouter)

app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
})
