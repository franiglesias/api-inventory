import { Message } from '../../driven/forDispatchingMessages/ForDispatchingMessages'

export class AddUnits implements Message {
  public readonly sku: string
  public readonly units: number

  constructor(sku: string, units: number) {
    this.sku = sku
    this.units = units
  }
}
