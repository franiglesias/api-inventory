import {GetProducts} from "./GetProducts";

export class GetProductsHandler {
    public handle(getProducts: GetProducts): any[] {
        console.log('GetProductsHandler.handle()')
        return [
            {
                id: "c1a9b9d2-6f20-4e1a-9f8a-1234567890ab",
                name: "USB-C Cable",
                description: "1m braided cable",
                sku: "USBC-1M-BRAIDED",
                stock: 42,
                minStock: 5,
                createdAt: "2019-08-24T14:15:22Z",
                updatedAt: "2019-08-24T14:15:22Z"
            }
        ]
    }
}
