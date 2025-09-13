export class NegativeStock implements Error {
  constructor(sku: string, available: number) {
    this.message = `Trying to remove too much stock for product '${sku}'. Available stock: ${available}`
    this.name = 'NegativeStock'
  }

  message: string
  name: string
}
