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
    const updated = this.getProductBySku(removeUnits.sku).removeStock(
      removeUnits.units,
      this.forGettingTime,
    )
    this.storeUpdatedProduct(updated)
    return updated.toStoredProduct()
  }

  private storeUpdatedProduct(updated: Product) {
    this.forStoringProducts.store(updated.toStoredProduct())
  }

  private getProductBySku(sku: string) {
    const storedProduct = this.forStoringProducts.retrieveBySku(sku)

    if (!storedProduct) throw new SkuNotFound(sku)

    return Product.fromStored(storedProduct)
  }
}
