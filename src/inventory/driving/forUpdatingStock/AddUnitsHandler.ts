import { MessageHandler } from '../../driven/forDispatchingMessages/ForDispatchingMessages'
import {
  ForStoringProducts,
  StoredProduct,
} from '../../driven/forStoringProducts/ForStoringProducts'
import { AddUnits } from './AddUnits'
import { SkuNotFound } from './SkuNotFound'
import { Product } from '../../Product'

export class AddUnitsHandler implements MessageHandler<AddUnits> {
  private forStoringProducts: ForStoringProducts

  constructor(forStoringProducts: ForStoringProducts) {
    this.forStoringProducts = forStoringProducts
  }

  public handle(addUnits: AddUnits): StoredProduct {
    const storedProduct = this.forStoringProducts.retrieveAll().find((product) => {
      return product.sku.toLowerCase() === addUnits.sku.toLowerCase()
    })

    if (!storedProduct) throw new SkuNotFound(addUnits.sku)

    const updated = Product.fromStored(storedProduct).addStock(addUnits.units)

    this.forStoringProducts.store(updated.toStoredProduct())
    return updated.toStoredProduct()
  }
}
