import {
  ForStoringProducts,
  StoredProduct,
} from "../../inventory/driven/forStoringProducts/ForStoringProducts"

export class ForStoringProductsMemoryAdapter implements ForStoringProducts {
  private readonly products: StoredProduct[] = []

  constructor(products: StoredProduct[]) {
    this.products = products
  }

  store(productToStore: StoredProduct): void {
    this.products.push(productToStore)
  }

  retrieveAll(): StoredProduct[] {
    return this.products
  }
}
