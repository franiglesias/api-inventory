import { GetProducts } from './GetProducts'
import {
  ForStoringProducts,
  StoredProduct,
} from '../../driven/forStoringProducts/ForStoringProducts'
import { Product } from '../../Product'
import { MessageHandler } from '../../driven/forDispatchingMessages/ForDispatchingMessages'

export class GetProductsHandler implements MessageHandler<GetProducts> {
  private forStoringProducts: ForStoringProducts

  constructor(forStoringProducts: ForStoringProducts) {
    this.forStoringProducts = forStoringProducts
  }

  public handle(_getProducts: GetProducts): Product[] {
    let storedProducts: StoredProduct[] = this.forStoringProducts.retrieveAll()

    return storedProducts.map(
      (product) =>
        new Product(
          product.id,
          product.name,
          product.description,
          product.sku,
          product.stock,
          product.minStock,
          product.createdAt,
          product.updatedAt,
          product.imageUrl,
        ),
    )
  }
}
