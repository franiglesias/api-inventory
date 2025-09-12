import { MessageHandler } from "../../driven/forDispatchingMessages/ForDispatchingMessages"
import { RemoveUnits } from "./RemoveUnits"
import { ForStoringProductsMemoryAdapter } from "../../../driven/forStoringProducts/MemoryAdapter"
import { StoredProduct } from "../../driven/forStoringProducts/ForStoringProducts"
import { SkuNotFound } from "./SkuNotFound"
import { NegativeStock } from "./NegativeStock"

export class RemoveUnitsHandler implements MessageHandler<RemoveUnits> {
  private forStoringProducts: ForStoringProductsMemoryAdapter

  constructor(forStoringProducts: ForStoringProductsMemoryAdapter) {
    this.forStoringProducts = forStoringProducts
  }

  handle(removeUnits: RemoveUnits): StoredProduct {
    const product = this.forStoringProducts.retrieveAll().find((product) => {
      return product.sku.toLowerCase() === removeUnits.sku.toLowerCase()
    })

    if (!product) {
      throw new SkuNotFound(removeUnits.sku)
    }

    if (product.stock - removeUnits.units < 0) {
      throw new NegativeStock(product.sku, product.stock)
    }

    product.stock -= removeUnits.units
    this.forStoringProducts.store(product)
    return product
  }
}
