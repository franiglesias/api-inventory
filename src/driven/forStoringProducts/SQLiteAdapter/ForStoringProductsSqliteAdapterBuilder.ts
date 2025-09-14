import { StoredProduct } from '../../../inventory/driven/forStoringProducts/ForStoringProducts'
import { InventoryDatabase } from './InventoryDatabase'
import { ForStoringProductsSqliteAdapter } from './SqliteAdapter'

export class ForStoringProductsSqliteAdapterBuilder {
  private sqlitePath!: string
  private initialProducts: StoredProduct[] = []

  fromPath(sqlitePath: string): ForStoringProductsSqliteAdapterBuilder {
    this.sqlitePath = sqlitePath
    return this
  }

  withSeed(initialProducts: StoredProduct[]): ForStoringProductsSqliteAdapterBuilder {
    this.initialProducts = initialProducts
    return this
  }

  build() {
    const database = InventoryDatabase.init(this.sqlitePath, this.initialProducts)
    return new ForStoringProductsSqliteAdapter(database)
  }
}
