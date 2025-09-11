import {ForDispatchingMessages} from "../../inventory/driven/forDispatchingMessages/ForDispatchingMessages";
import {MessageBus} from "../../lib/message.bus";

export class MessageBusAdapter implements ForDispatchingMessages{
    private messageBus: MessageBus;
    constructor(messageBus: MessageBus) {
        this.messageBus = messageBus;
    }
    dispatch(message: any): any {
        return this.messageBus.dispatch(message);
    }
}
