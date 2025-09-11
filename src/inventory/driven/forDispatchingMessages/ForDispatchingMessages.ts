export interface ForDispatchingMessages {
    dispatch(message: Message): any;
}

export interface Message {}

export interface MessageHandler<T> {
    handle(command: T): any;
}
