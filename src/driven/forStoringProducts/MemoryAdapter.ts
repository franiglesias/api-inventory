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
    const index = this.products.findIndex((p) => p.id === productToStore.id)
    if (index !== -1) {
      this.products[index] = productToStore
    } else {
      this.products.push(productToStore)
    }
  }

  retrieveAll(): StoredProduct[] {
    return this.products
  }
}
