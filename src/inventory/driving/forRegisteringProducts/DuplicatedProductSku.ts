export class DuplicatedProductSku implements Error {
  message: string
  name: string

  constructor(sku: string) {
    this.message = `SKU '${sku}' already exists`
    this.name = 'DuplicatedProductSKu'
  }
}
