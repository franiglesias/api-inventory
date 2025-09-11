import express from "express";

import dotenv from "dotenv";
import {GetHealth} from "./inventory/driving/forCheckingHealth/GetHealth";
import {GetHealthHandler} from "./inventory/driving/forCheckingHealth/GetHealthHandler";
import {ForCheckingHealthApiAdapter} from "./driving/forCheckingHealth/ApiAdapter";


dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.get("/", (request, response) => {
    response.status(200).send("Hello World");
});

app.get("/health", (request, response) => {
    const controller = new ForCheckingHealthApiAdapter();
    controller.getHealth(request, response);
})

app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
})
