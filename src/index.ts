import express from "express";

import dotenv from "dotenv";

import inventoryRouter from './router/router'

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use('/', inventoryRouter)

app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
})
