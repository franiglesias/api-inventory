import { MessageHandler } from '../../driven/forDispatchingMessages/ForDispatchingMessages'
import { RemoveUnits } from './RemoveUnits'
import {
  ForStoringProducts,
  StoredProduct,
} from '../../driven/forStoringProducts/ForStoringProducts'
import { SkuNotFound } from './SkuNotFound'
import { Product } from '../../Product'
import { ForGettingTime } from '../../driven/forGettingTime/ForGettingTime'

export class RemoveUnitsHandler implements MessageHandler<RemoveUnits> {
  private forStoringProducts: ForStoringProducts
  private readonly forGettingTime: ForGettingTime

  constructor(forStoringProducts: ForStoringProducts, forGettingTime: ForGettingTime) {
    this.forStoringProducts = forStoringProducts
    this.forGettingTime = forGettingTime
  }

  handle(removeUnits: RemoveUnits): StoredProduct {
    const product = this.retrieveProductData(removeUnits.sku)

    const updated = Product.fromStored(product).removeStock(removeUnits.units, this.forGettingTime)

    this.forStoringProducts.store(updated.toStoredProduct())
    return updated.toStoredProduct()
  }

  private retrieveProductData(sku: string) {
    const product = this.forStoringProducts.retrieveAll().find((product) => {
      return product.sku.toLowerCase() === sku.toLowerCase()
    })

    if (!product) {
      throw new SkuNotFound(sku)
    }
    return product
  }
}
