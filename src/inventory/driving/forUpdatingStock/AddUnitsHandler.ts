import { MessageHandler } from '../../driven/forDispatchingMessages/ForDispatchingMessages'
import {
  ForStoringProducts,
  StoredProduct,
} from '../../driven/forStoringProducts/ForStoringProducts'
import { AddUnits } from './AddUnits'
import { SkuNotFound } from './SkuNotFound'
import { Product } from '../../Product'
import { ForGettingTime } from '../../driven/forGettingTime/ForGettingTime'

export class AddUnitsHandler implements MessageHandler<AddUnits> {
  private forStoringProducts: ForStoringProducts
  private forGettingTime: ForGettingTime

  constructor(forStoringProducts: ForStoringProducts, forGettingTime: ForGettingTime) {
    this.forStoringProducts = forStoringProducts
    this.forGettingTime = forGettingTime
  }

  public handle(addUnits: AddUnits): StoredProduct {
    const storedProduct = this.retrieveProductData(addUnits.sku)

    const updated = Product.fromStored(storedProduct).addStock(addUnits.units, this.forGettingTime)

    this.forStoringProducts.store(updated.toStoredProduct())
    return updated.toStoredProduct()
  }

  private retrieveProductData(sku: string) {
    const storedProduct = this.forStoringProducts.retrieveBySku(sku)

    if (!storedProduct) throw new SkuNotFound(sku)
    return storedProduct
  }
}
