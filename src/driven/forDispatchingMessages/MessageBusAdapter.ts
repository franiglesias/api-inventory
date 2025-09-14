import {
  ForDispatchingMessages,
  Message,
} from '../../inventory/driven/forDispatchingMessages/ForDispatchingMessages'
import { MessageBus } from '../../lib/message-bus'
import { Message as LibMessage } from '../../lib/message'

export class MessageBusAdapter implements ForDispatchingMessages {
  private messageBus: MessageBus
  constructor(messageBus: MessageBus) {
    this.messageBus = messageBus
  }

  async dispatch(message: Message): Promise<any> {
    return await this.messageBus.dispatch(message as LibMessage)
  }
}
