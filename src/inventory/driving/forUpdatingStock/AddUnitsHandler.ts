import { MessageHandler } from "../../driven/forDispatchingMessages/ForDispatchingMessages"
import {
  ForStoringProducts,
  StoredProduct,
} from "../../driven/forStoringProducts/ForStoringProducts"
import { AddUnits } from "./AddUnits"
import { SkuNotFound } from "./SkuNotFound"

export class AddUnitsHandler implements MessageHandler<AddUnits> {
  private forStoringProducts: ForStoringProducts

  constructor(forStoringProducts: ForStoringProducts) {
    this.forStoringProducts = forStoringProducts
  }

  public handle(addUnits: AddUnits): StoredProduct {
    const product = this.forStoringProducts.retrieveAll().find((product) => {
      return product.sku.toLowerCase() === addUnits.sku.toLowerCase()
    })

    if (!product) throw new SkuNotFound(addUnits.sku)

    product.stock += addUnits.units
    this.forStoringProducts.store(product)
    return product
  }
}
