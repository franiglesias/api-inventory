import { ForDispatchingMessages } from '../../inventory/driven/forDispatchingMessages/ForDispatchingMessages'
import { Request, Response } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
import { RegisterProduct } from '../../inventory/driving/forRegisteringProducts/RegisterProduct'
import { DuplicatedProductSku } from '../../inventory/driving/forRegisteringProducts/DuplicatedProductSku'

export class ForRegisterProductsApiAdapter {
  private forDispatching: ForDispatchingMessages

  constructor(forDispatching: ForDispatchingMessages) {
    this.forDispatching = forDispatching
  }

  public async postProducts(
    req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    response: Response<any, Record<string, any>, number>,
  ) {
    const body = req.body || {}

    const productFields = {
      name: body.name,
      description: body.description,
      sku: body.sku,
      initialStock: body.initialStock,
      minStock: body.minStock,
      imageUrl: body.imageUrl,
    }

    const emptyFields = Object.entries(productFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key)
      .filter((field) => field !== 'description' && field !== 'imageUrl')

    if (emptyFields.length > 0) {
      return response.status(400).json({
        error: `Missing required fields: ${emptyFields.join(', ')}`,
        code: 400,
      })
    }

    const command = new RegisterProduct(
      productFields.name,
      productFields.description,
      productFields.sku,
      productFields.initialStock,
      productFields.minStock,
      productFields.imageUrl,
    )

    try {
      const product = await this.forDispatching.dispatch(command)
      response.status(201).json(product)
    } catch (e) {
      if (e instanceof DuplicatedProductSku) {
        return response.status(409).json({
          error: e.message,
          code: 409,
        })
      }
    }
  }
}
