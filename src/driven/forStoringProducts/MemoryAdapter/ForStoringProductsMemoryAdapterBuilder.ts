import { StoredProduct } from '../../../inventory/driven/forStoringProducts/ForStoringProducts'
import { ForStoringProductsMemoryAdapter } from './MemoryAdapter'

export class ForStoringProductsMemoryAdapterBuilder {
  private initialProducts: StoredProduct[] = []

  withSeed(initialProducts: StoredProduct[]): ForStoringProductsMemoryAdapterBuilder {
    this.initialProducts = initialProducts
    return this
  }

  build() {
    return new ForStoringProductsMemoryAdapter(this.initialProducts)
  }
}
