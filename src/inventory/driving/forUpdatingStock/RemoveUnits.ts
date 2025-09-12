import { Message } from "../../../lib/message"

export class RemoveUnits implements Message {
  public sku: string
  public units: number

  constructor(sku: string, units: number) {
    this.sku = sku
    this.units = units
  }
}
