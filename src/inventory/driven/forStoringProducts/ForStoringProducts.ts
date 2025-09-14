import { Message } from '../forDispatchingMessages/ForDispatchingMessages'

export class StoredProduct implements Message {
  public id!: string
  public name!: string
  public description!: string
  public sku!: string
  public imageUrl?: string
  public stock!: number
  public minStock!: number
  public createdAt!: Date
  public updatedAt?: Date
}

export interface ForStoringProducts {
  retrieveAll(): StoredProduct[]

  store(productToStore: StoredProduct): void

  retrieveBySku(sku: string): StoredProduct | undefined
}
