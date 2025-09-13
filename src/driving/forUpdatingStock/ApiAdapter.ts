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

  public postAddUnits(
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
    const body = req.body || {}
    const params = req.params

    let sku = params.sku
    const units = body.units

    if (!sku.trim()) {
      response.status(400).json({ error: 'SKU no válido' })
      return
    }
    sku = sku.trim().toLowerCase()

    if (typeof units !== 'number' || units <= 0) {
      response.status(400).json({ error: 'Units no válido o menor igual a 0' })
      return
    }

    try {
      const addUnits = new AddUnits(sku, units)
      const product = this.forDispatching.dispatch(addUnits)
      response.status(200).json({ product })
    } catch (error) {
      if (error instanceof SkuNotFound) {
        response.status(404).json({ error: error.message })
      }
      response
        .status(500)
        .json({ error: 'Error interno del servidor: ' + (error as Error).message })
    }
  }

  public postRemoveUnits(
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
    const body = req.body || {}
    const params = req.params

    let sku = params.sku
    const units = body.units

    if (!sku.trim()) {
      response.status(400).json({ error: 'SKU no válido' })
      return
    }
    sku = sku.trim().toLowerCase()

    if (typeof units !== 'number' || units <= 0) {
      response.status(400).json({ error: 'Units no válido o menor igual a 0' })
      return
    }

    try {
      const addUnits = new RemoveUnits(sku, units)
      const product = this.forDispatching.dispatch(addUnits)
      response.status(200).json({ product })
    } catch (error) {
      if (error instanceof SkuNotFound) {
        response.status(404).json({ error: error.message, code: 404 })
      }
      if (error instanceof NegativeStock) {
        response.status(400).json({ error: error.message, code: 400 })
      }
      response
        .status(500)
        .json({ error: 'Error interno del servidor: ' + (error as Error).message })
    }
  }
}
