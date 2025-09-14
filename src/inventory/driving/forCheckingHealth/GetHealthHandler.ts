import { GetHealth } from './GetHealth'
import { MessageHandler } from '../../driven/forDispatchingMessages/ForDispatchingMessages'

export class GetHealthHandler implements MessageHandler<GetHealth> {
  public handle(_getHealth: GetHealth): boolean {
    return true
  }
}
