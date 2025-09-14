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
  private readonly forGettingTime: ForGettingTime

  constructor(forStoringProducts: ForStoringProducts, forGettingTime: ForGettingTime) {
    this.forStoringProducts = forStoringProducts
    this.forGettingTime = forGettingTime
  }

  public handle(addUnits: AddUnits): StoredProduct {
    const updated = this.getProductBySku(addUnits.sku).addStock(addUnits.units, this.forGettingTime)
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
