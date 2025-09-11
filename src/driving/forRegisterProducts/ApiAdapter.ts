import {ForDispatchingMessages} from "../../inventory/driven/forDispatchingMessages/ForDispatchingMessages";
import {Request, Response} from "express-serve-static-core";
import {ParsedQs} from "qs";
import {RegisterProduct} from "../../inventory/driving/forRegisteringProducts/RegisterProduct";

export class ForRegisterProductsApiAdapter {
    private forDispatching: ForDispatchingMessages;

    constructor(forDispatching: ForDispatchingMessages) {
        this.forDispatching = forDispatching;
    }

    public postProducts(req: Request<{}, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>, number>) {
        const body = req.body || {};
        const {name, description, sku, initialStock, minStock} = body;

        if (!name || !sku) {
            return response.status(400).json({message: "Missing required fields: name and sku"});
        }

        const command = new RegisterProduct()
        command.name = name;
        command.description = description;
        command.sku = sku;
        command.initialStock = initialStock;
        command.minStock = minStock;

        const product = this.forDispatching.dispatch(command);
        response.status(201).json(product)
    }
}
