import {ForDispatchingMessages, Message} from "../../inventory/driven/forDispatchingMessages/ForDispatchingMessages";
import {MessageBus} from "../../lib/message-bus";
import {Message as LibMessage} from "../../lib/message";

export class MessageBusAdapter implements ForDispatchingMessages{
    private messageBus: MessageBus;
    constructor(messageBus: MessageBus) {
        this.messageBus = messageBus;
    }
    dispatch(message: Message): any {
        return this.messageBus.dispatch(message as LibMessage);
    }
}
