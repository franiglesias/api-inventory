import { MessageHandler } from '../../driven/forDispatchingMessages/ForDispatchingMessages'
import { RemoveUnits } from './RemoveUnits'
import { ForStoringProductsMemoryAdapter } from '../../../driven/forStoringProducts/MemoryAdapter'
import { StoredProduct } from '../../driven/forStoringProducts/ForStoringProducts'
import { SkuNotFound } from './SkuNotFound'
import { Product } from '../../Product'

export class RemoveUnitsHandler implements MessageHandler<RemoveUnits> {
  private forStoringProducts: ForStoringProductsMemoryAdapter

  constructor(forStoringProducts: ForStoringProductsMemoryAdapter) {
    this.forStoringProducts = forStoringProducts
  }

  handle(removeUnits: RemoveUnits): StoredProduct {
    const product = this.retrieveProductData(removeUnits.sku)

    const updated = Product.fromStored(product).removeStock(removeUnits.units)

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
