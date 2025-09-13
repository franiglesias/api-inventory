import {
  ForStoringProducts,
  StoredProduct,
} from "../../driven/forStoringProducts/ForStoringProducts"
import { RegisterProduct } from "./RegisterProduct"
import { MessageHandler } from "../../driven/forDispatchingMessages/ForDispatchingMessages"
import { Product } from "../../Product"
import { v4 } from "uuid"
import { DuplicatedProductSku } from "./DuplicatedProductSku"

export class RegisterProductHandler implements MessageHandler<RegisterProduct> {
  private forStoringProducts: ForStoringProducts

  constructor(forStoringProducts: ForStoringProducts) {
    this.forStoringProducts = forStoringProducts
  }

  public handle(registerProduct: RegisterProduct): StoredProduct {
    const skuExists = this.forStoringProducts
      .retrieveAll()
      .some((product) => product.sku === registerProduct.sku)

    if (skuExists) throw new DuplicatedProductSku(registerProduct.sku)

    const product = Product.register(
      this.generateId(),
      registerProduct.name,
      registerProduct.description,
      registerProduct.sku,
      registerProduct.initialStock,
      registerProduct.minStock,
      registerProduct.imageUrl,
    )

    const productToStore: StoredProduct = product.toStoredProduct()

    this.forStoringProducts.store(productToStore)

    return productToStore
  }

  private generateId() {
    return v4()
  }
}
