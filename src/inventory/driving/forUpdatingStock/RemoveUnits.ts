import { Message } from '../../../lib/message'

export class RemoveUnits implements Message {
  public readonly sku: string
  public readonly units: number

  constructor(sku: string, units: number) {
    this.sku = sku
    this.units = units
  }
}
