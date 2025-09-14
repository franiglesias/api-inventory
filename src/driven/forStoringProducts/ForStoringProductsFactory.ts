import { ForStoringProducts } from '../../inventory/driven/forStoringProducts/ForStoringProducts'
import { ForStoringProductsSqliteAdapterBuilder } from './SQLiteAdapter/ForStoringProductsSqliteAdapterBuilder'
import { readProductsFromFile } from '../../lib/read-products'
import { ForStoringProductsMemoryAdapterBuilder } from './MemoryAdapter/ForStoringProductsMemoryAdapterBuilder'

export class ForStoringProductsFactory {
  private sqlitePath: string = './data/inventory.db'
  private file: string = './data/products.json'

  constructor() {}

  withSqlitePath(sqlitePath: string): ForStoringProductsFactory {
    this.sqlitePath = sqlitePath
    return this
  }

  withFileSeed(file: string): ForStoringProductsFactory {
    this.file = file
    return this
  }
  create(storageAdapter: string): ForStoringProducts {
    const seededProducts = readProductsFromFile(this.file)
    if (storageAdapter === 'sqlite') {
      return new ForStoringProductsSqliteAdapterBuilder()
        .withSeed(seededProducts)
        .fromPath(this.sqlitePath)
        .build()
    }
    return new ForStoringProductsMemoryAdapterBuilder().withSeed(seededProducts).build()
  }
}
