import { ForDispatchingMessages } from '../../inventory/driven/forDispatchingMessages/ForDispatchingMessages'
import { Request, Response } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
import { GetProducts } from '../../inventory/driving/forGettingProducts/GetProducts'

export class ForGettingProductsApiAdapter {
  private forDispatching: ForDispatchingMessages

  constructor(forDispatching: ForDispatchingMessages) {
    this.forDispatching = forDispatching
  }

  public async getProducts(
    _req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    response: Response<any, Record<string, any>, number>,
  ): Promise<void> {
    const command = new GetProducts()
    const productList = await this.forDispatching.dispatch(command)
    response.status(200).json(productList)
  }
}
