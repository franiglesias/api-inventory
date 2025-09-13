export class UnsupportedCommand implements Error {
  name: string
  message: string
  stack?: string
  cause?: unknown

  constructor() {
    this.name = 'UnsupportedCommand'
    this.message = 'Unsupported command'
  }
}
