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

dotenv.config();

function buildMessageBusInstance(): MessageBusAdapter {
    const messageBus = new MessageBus();
    messageBus.register(GetHealth, new GetHealthHandler())
    messageBus.register(GetProducts, new GetProductsHandler())
    return new MessageBusAdapter(messageBus);
}

const forDispatching = buildMessageBusInstance();

const forCheckingHealth = new ForCheckingHealthApiAdapter(forDispatching)
const forGettingProducts = new ForGettingProductsApiAdapter(forDispatching)

inventoryRouter.get("/products", forGettingProducts.getProducts.bind(forGettingProducts))
inventoryRouter.get("/health", forCheckingHealth.getHealth.bind(forCheckingHealth))

inventoryRouter.get("/", (request, response) => response.status(200).send("Hello World"));


const app = express();

const PORT = process.env.PORT;

app.use('/', inventoryRouter)

app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
})
