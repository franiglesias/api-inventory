import express from "express";

import dotenv from "dotenv";
import {GetHealth} from "./inventory/driving/forCheckingHealth/GetHealth";
import {GetHealthHandler} from "./inventory/driving/forCheckingHealth/GetHealthHandler";


dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.get("/", (request, response) => {
    response.status(200).send("Hello World");
});

app.get("/health", (request, response) => {
    const getHealth = new GetHealth()
    const getHealthHandler = new GetHealthHandler()
    if (getHealthHandler.handle(getHealth)) {
        response.status(200).json({
            status: 'ok'
        });
    }
    response.status(500).json({
        error: "Internal Server Error. App is not working.",
        code: "500"
    })

})

app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
})
