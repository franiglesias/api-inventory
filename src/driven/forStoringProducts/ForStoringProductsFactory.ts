import { ForStoringProducts } from '../../inventory/driven/forStoringProducts/ForStoringProducts'
import { ForStoringProductsSqliteAdapterBuilder } from './ForStoringProductsSqliteAdapterBuilder'
import { readProductsFromFile } from '../../lib/read-products'
import { ForStoringProductsMemoryAdapterBuilder } from './ForStoringProductsMemoryAdapterBuilder'

export class ForStoringProductsFactory {
  create(storageAdapter: string): ForStoringProducts {
    if (storageAdapter === 'sqlite') {
      return new ForStoringProductsSqliteAdapterBuilder()
        .withSeed(readProductsFromFile())
        .fromPath(process.env.SQLITE_DB_PATH || './data/inventory.db')
        .build()
    } else {
      return new ForStoringProductsMemoryAdapterBuilder().withSeed(readProductsFromFile()).build()
    }
  }
}
