import { Message } from './message'
import { UnsupportedCommand } from './unsupported.command'

export interface MessageHandler<T> {
  handle(command: T): any
}

export class MessageBus {
  private handlers: Map<string, MessageHandler<unknown>> = new Map()

  public async dispatch(command: Message): Promise<any> {
    const handler = this.handlers.get(command.constructor.name)
    console.log('[MessageBus] Dispatching:', command.constructor.name)
    if (handler === undefined) throw new UnsupportedCommand()
    console.log('[MessageBus] Handler found:', handler.constructor.name)
    return handler.handle(command)
  }

  register(command: { name: string }, handler: MessageHandler<unknown>) {
    this.handlers.set(command.name, handler)
  }
}
