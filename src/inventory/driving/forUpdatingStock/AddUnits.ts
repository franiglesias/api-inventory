import { Message } from "../../driven/forDispatchingMessages/ForDispatchingMessages"

export class AddUnits implements Message {
  public sku: string
  public units: number

  constructor(sku: string, units: number) {
    this.sku = sku
    this.units = units
  }
}
