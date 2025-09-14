import {
  ForStoringProducts,
  StoredProduct,
} from '../../../inventory/driven/forStoringProducts/ForStoringProducts'

export class ForStoringProductsMemoryAdapter implements ForStoringProducts {
  private readonly products: StoredProduct[] = []

  constructor(products: StoredProduct[]) {
    this.products = products
  }

  retrieveBySku(sku: string): StoredProduct | undefined {
    return this.products.find((product: StoredProduct): boolean => {
      return product.sku.toLowerCase() === sku.toLowerCase()
    })
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
