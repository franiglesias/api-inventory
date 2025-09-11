import {ForStoringProducts, StoredProduct} from "../../driven/forStoringProducts/ForStoringProducts";
import {RegisterProduct} from "./RegisterProduct";
import {MessageHandler} from "../../driven/forDispatchingMessages/ForDispatchingMessages";
import {Product} from "../../Product";
import {v4} from "uuid";

export class RegisterProductHandler implements MessageHandler<RegisterProduct> {
    private forStoringProducts: ForStoringProducts


    constructor(forStoringProducts: ForStoringProducts) {
        this.forStoringProducts = forStoringProducts;
    }

    public handle(registerProduct: RegisterProduct) {
        const product = Product.register(
            this.generateId(),
            registerProduct.name,
            registerProduct.description,
            registerProduct.sku,
            registerProduct.initialStock,
            registerProduct.minStock)

        const productToStore: StoredProduct = product.toStoredProduct()

        this.forStoringProducts.store(productToStore)

        return productToStore
    }

    private generateId() {
        return v4();
    }
}
