export interface ForDispatchingMessages {
  dispatch(message: Message): any
}

export interface Message {}

export interface MessageHandler<T extends Message> {
  handle(command: T): any
}
