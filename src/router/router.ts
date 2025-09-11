import express from "express";
import {ForCheckingHealthApiAdapter} from "../driving/forCheckingHealth/ApiAdapter";

const router = express.Router();

router.get("/health", (request, response) => {
    const controller = new ForCheckingHealthApiAdapter();
    controller.getHealth(request, response);
});

router.get("/", (request, response) => response.status(200).send("Hello World"));

export default router;
