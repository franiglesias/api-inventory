import { describe, expect, it } from 'vitest'
import { Message } from './message'
import { MessageBus, MessageHandler } from './message-bus'
import { UnsupportedCommand } from './unsupported.command'

class UnknownCommand implements Message {}
class ACommand implements Message {}

class ACommandHandler implements MessageHandler<ACommand> {
  handle(command: ACommand) {
    throw new Error('Method not implemented.')
  }
}

describe('MessageBus', () => {
  describe('When invoked', () => {
    it('should fail if not registered command', () => {
      const bus = new MessageBus()
      console.log('Unknown command class name:', UnknownCommand.name) // prints "UnknownCommand"
      expect(() => bus.dispatch(new UnknownCommand())).toThrow(UnsupportedCommand)
    })

    it('should fail if registering unsupported', () => {
      const bus = new MessageBus()

      bus.register(UnknownCommand, new ACommandHandler())
      expect(() => bus.dispatch(new UnknownCommand())).toThrowError('Method not implemented.')
    })

    it('should pass if registered command', () => {
      const bus = new MessageBus()

      bus.register(ACommand, new ACommandHandler())
      expect(() => bus.dispatch(new ACommand())).toThrowError('Method not implemented.')
    })
  })
})
