import { Request, Response } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
import { GetHealth } from '../../inventory/driving/forCheckingHealth/GetHealth'
import { ForDispatchingMessages } from '../../inventory/driven/forDispatchingMessages/ForDispatchingMessages'

export class ForCheckingHealthApiAdapter {
  private forDispatching: ForDispatchingMessages

  constructor(forDispatching: ForDispatchingMessages) {
    this.forDispatching = forDispatching
  }

  public async getHealth(
    req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    response: Response<any, Record<string, any>, number>,
  ): Promise<void> {
    const getHealth = new GetHealth()
    if (await this.forDispatching.dispatch(getHealth)) {
      response.status(200).json({
        status: 'ok',
      })
      return
    }
    response.status(500).json({
      error: 'Internal Server Error. App is not working.',
      code: '500',
    })
  }
}
