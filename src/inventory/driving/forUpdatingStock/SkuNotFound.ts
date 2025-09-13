export class SkuNotFound implements Error {
  constructor(sku: string) {
    this.message = `Product with SKU ${sku} not found`
    this.name = 'SkuNotFound'
  }

  message: string
  name: string
}
