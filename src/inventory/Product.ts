import { ForGettingTime } from './driven/forGettingTime/ForGettingTime'
import { StoredProduct } from './driven/forStoringProducts/ForStoringProducts'
import { NegativeStock } from './driving/forUpdatingStock/NegativeStock'

export class Product {
  private readonly id: string
  private readonly name: string
  private readonly description: string
  private readonly sku: string
  private readonly imageUrl?: string | undefined
  private readonly stock: number
  private readonly minStock: number
  private readonly createdAt: Date
  private readonly updatedAt: Date | undefined

  constructor(
    id: string,
    name: string,
    description: string,
    sku: string,
    stock: number,
    minStock: number,
    createdAt: Date,
    updatedAt?: Date,
    imageUrl?: string | undefined,
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.sku = sku
    this.stock = stock
    this.minStock = minStock
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.imageUrl = imageUrl
  }

  static register(
    id: string,
    name: string,
    description: string,
    sku: string,
    initialStock: number,
    minStock: number,
    imageUrl?: string,
  ) {
    return new Product(
      id,
      name,
      description,
      sku,
      initialStock,
      minStock,
      new Date(),
      undefined,
      imageUrl,
    )
  }

  toStoredProduct(): StoredProduct {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      sku: this.sku,
      imageUrl: this.imageUrl,
      stock: this.stock,
      minStock: this.minStock,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    } as StoredProduct
  }

  static fromStored(storedProduct: StoredProduct): Product {
    return new Product(
      storedProduct.id,
      storedProduct.name,
      storedProduct.description,
      storedProduct.sku,
      storedProduct.stock,
      storedProduct.minStock,
      storedProduct.createdAt,
      storedProduct.updatedAt,
      storedProduct.imageUrl,
    )
  }

  addStock(units: number, forGettingTime: ForGettingTime): Product {
    return new Product(
      this.id,
      this.name,
      this.description,
      this.sku,
      this.stock + units,
      this.minStock,
      this.createdAt,
      forGettingTime.now(),
      this.imageUrl,
    )
  }

  removeStock(units: number, forGettingTime: ForGettingTime): Product {
    if (this.stock - units < 0) {
      throw new NegativeStock(this.sku, this.stock)
    }

    return new Product(
      this.id,
      this.name,
      this.description,
      this.sku,
      this.stock - units,
      this.minStock,
      this.createdAt,
      forGettingTime.now(),
      this.imageUrl,
    )
  }
}
