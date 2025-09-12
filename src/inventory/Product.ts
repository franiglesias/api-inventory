import { StoredProduct } from "./driven/forStoringProducts/ForStoringProducts"

export class Product {
  private id: string
  private name: string
  private description: string
  private sku: string
  private stock: number
  private minStock: number
  private createdAt: Date
  private updatedAt: Date | undefined

  constructor(
    id: string,
    name: string,
    description: string,
    sku: string,
    stock: number,
    minStock: number,
    createdAt: Date,
    updatedAt?: Date,
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.sku = sku
    this.stock = stock
    this.minStock = minStock
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static register(
    id: string,
    name: string,
    description: string,
    sku: string,
    initialStock: number,
    minStock: number,
  ) {
    return new Product(id, name, description, sku, initialStock, minStock, new Date(), undefined)
  }

  toStoredProduct(): StoredProduct {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      sku: this.sku,
      stock: this.stock,
      minStock: this.minStock,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    } as StoredProduct
  }
}
