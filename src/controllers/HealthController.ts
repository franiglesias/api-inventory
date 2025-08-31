import type {Request, Response} from 'express'

/**
 * A simple controller demonstrating a healthcheck endpoint.
 */
export default class HealthController {
  public handle(req: Request, res: Response): void {
    res.status(200).json({ status: 'ok' })
  }
}
