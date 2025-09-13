import { Message } from '../../driven/forDispatchingMessages/ForDispatchingMessages'

export class RegisterProduct implements Message {
  public readonly name: string
  public readonly description: string
  public readonly sku: string
  public readonly initialStock: number
  public readonly minStock: number
  public readonly imageUrl?: string | undefined

  constructor(
    name: string,
    description: string,
    sku: string,
    initialStock: number,
    minStock: number,
    imageUrl?: string,
  ) {
    this.name = name
    this.description = description
    this.sku = sku
    this.initialStock = initialStock
    this.minStock = minStock
    this.imageUrl = imageUrl
  }
}
