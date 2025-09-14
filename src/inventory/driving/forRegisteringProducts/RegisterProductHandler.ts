import {
  ForStoringProducts,
  StoredProduct,
} from '../../driven/forStoringProducts/ForStoringProducts'
import { RegisterProduct } from './RegisterProduct'
import { MessageHandler } from '../../driven/forDispatchingMessages/ForDispatchingMessages'
import { Product } from '../../Product'
import { v4 } from 'uuid'
import { DuplicatedProductSku } from './DuplicatedProductSku'

export class RegisterProductHandler implements MessageHandler<RegisterProduct> {
  private forStoringProducts: ForStoringProducts

  constructor(forStoringProducts: ForStoringProducts) {
    this.forStoringProducts = forStoringProducts
  }

  public handle(registerProduct: RegisterProduct): StoredProduct {
    this.assertUniqueSku(registerProduct.sku)

    const product = Product.register(
      this.generateId(),
      registerProduct.name,
      registerProduct.description,
      registerProduct.sku,
      registerProduct.initialStock,
      registerProduct.minStock,
      registerProduct.imageUrl,
    )

    this.storeProduct(product)

    return product.toStoredProduct()
  }

  private storeProduct(product: Product): void {
    const productToStore: StoredProduct = product.toStoredProduct()

    this.forStoringProducts.store(productToStore)
  }

  private assertUniqueSku(sku: string): void {
    const existingProduct = this.forStoringProducts.retrieveBySku(sku)

    if (existingProduct) throw new DuplicatedProductSku(sku)
  }

  private generateId() {
    return v4()
  }
}
