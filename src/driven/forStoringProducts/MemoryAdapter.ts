import {ForStoringProducts, StoredProduct} from "../../inventory/driven/forStoringProducts/ForStoringProducts";

export class ForStoringProductsMemoryAdapter implements ForStoringProducts{
    private products: StoredProduct[] = [];

    constructor(products: StoredProduct[]) {
        this.products = products;
    }

    retrieveAll(): StoredProduct[] {
        return this.products;
    }
}
