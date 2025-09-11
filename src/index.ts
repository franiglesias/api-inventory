import express from "express";

import dotenv from "dotenv";

import inventoryRouter from './driving/router/router'
import {MessageBus} from "./lib/message.bus";
import {GetHealth} from "./inventory/driving/forCheckingHealth/GetHealth";
import {GetHealthHandler} from "./inventory/driving/forCheckingHealth/GetHealthHandler";
import {MessageBusAdapter} from "./driven/forDispatchingMessages/MessageBusAdapter";
import {ForCheckingHealthApiAdapter} from "./driving/forCheckingHealth/ApiAdapter";

dotenv.config();

function buildMessageBusInstance(): MessageBusAdapter {
    const messageBus = new MessageBus();
    messageBus.register(GetHealth, new GetHealthHandler())
    return new MessageBusAdapter(messageBus);
}

const forDispatching = buildMessageBusInstance();

const forCheckingHealth = new ForCheckingHealthApiAdapter(forDispatching)

inventoryRouter.get("/health", (request, response) => {
    forCheckingHealth.getHealth(request, response);
});

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
