import { Message } from '../../driven/forDispatchingMessages/ForDispatchingMessages'

export class RegisterProduct implements Message {
  public name: string
  public description: string
  public sku: string
  public initialStock: number
  public minStock: number
  public imageUrl?: string

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
