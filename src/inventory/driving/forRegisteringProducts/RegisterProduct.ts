import {Message} from "../../driven/forDispatchingMessages/ForDispatchingMessages";

export class RegisterProduct implements Message {
    public name!: string;
    public description!: string
    public sku!: string
    public initialStock!: number
    public minStock!: number
}
