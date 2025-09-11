import {GetProducts} from "./GetProducts";
import {ForStoringProducts, StoredProduct} from "../../driven/forStoringProducts/ForStoringProducts";
import {Product} from "../../Product";


export class GetProductsHandler {
    private forStoringProducts: ForStoringProducts

    constructor(forStoringProducts: ForStoringProducts) {
        this.forStoringProducts = forStoringProducts;
    }

    public handle(getProducts: GetProducts): Product[] {
        console.log('GetProductsHandler.handle()')
        let storedProducts: StoredProduct[] = this.forStoringProducts.retrieveAll();

        return storedProducts.map(product => new Product(product.id, product.name, product.description, product.sku, product.stock, product.minStock, product.createdAt, product.updatedAt))
    }
}
