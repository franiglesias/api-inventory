import { ForDispatchingMessages } from '../../inventory/driven/forDispatchingMessages/ForDispatchingMessages'
import { Request, Response } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
import { AddUnits } from '../../inventory/driving/forUpdatingStock/AddUnits'
import { SkuNotFound } from '../../inventory/driving/forUpdatingStock/SkuNotFound'
import { RemoveUnits } from '../../inventory/driving/forUpdatingStock/RemoveUnits'
import { NegativeStock } from '../../inventory/driving/forUpdatingStock/NegativeStock'

export class ForUpdatingStockApiAdapter {
  private forDispatching: ForDispatchingMessages

  constructor(forDispatching: ForDispatchingMessages) {
    this.forDispatching = forDispatching
  }

  public async postAddUnits(
    req: Request<
      {
        sku: string
      },
      any,
      any,
      ParsedQs,
      Record<string, any>
    >,
    response: Response<any, Record<string, any>, number>,
  ) {
    return this.handleUnits(
      req,
      response,
      (sku, units) => new AddUnits(sku, units),
      (error: unknown) => {
        if (error instanceof SkuNotFound) {
          response.status(404).json({ error: error.message })
          return true
        }
        return false
      },
    )
  }

  public async postRemoveUnits(
    req: Request<
      {
        sku: string
      },
      any,
      any,
      ParsedQs,
      Record<string, any>
    >,
    response: Response<any, Record<string, any>, number>,
  ) {
    return this.handleUnits(
      req,
      response,
      (sku, units) => new RemoveUnits(sku, units),
      (error: unknown) => {
        if (error instanceof SkuNotFound) {
          response.status(404).json({ error: (error as SkuNotFound).message, code: 404 })
          return true
        }
        if (error instanceof NegativeStock) {
          response.status(400).json({ error: (error as NegativeStock).message, code: 400 })
          return true
        }
        return false
      },
    )
  }

  private async handleUnits(
    req: Request<{ sku: string }, any, any, ParsedQs, Record<string, any>>,
    response: Response<any, Record<string, any>, number>,
    buildCommand: (sku: string, units: number) => any,
    handleError?: (error: unknown) => boolean,
  ) {
    const body = req.body || {}
    const params = req.params

    let sku = params.sku
    const units = body.units

    if (!sku.trim()) {
      response.status(400).json({ error: 'SKU no válido' })
      return
    }
    sku = sku.trim()

    if (typeof units !== 'number' || units <= 0) {
      response.status(400).json({ error: 'Units no válido o menor igual a 0' })
      return
    }

    try {
      const command = buildCommand(sku, units)
      const product = await this.forDispatching.dispatch(command)
      response.status(200).json({ product })
    } catch (error) {
      if (handleError && handleError(error)) return
      response
        .status(500)
        .json({ error: 'Error interno del servidor: ' + (error as Error).message })
    }
  }
}
