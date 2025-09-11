export class StoredProduct {
    public id!: string;
    public name!: string
    public description!: string
    public sku!: string
    public stock!: number
    public minStock!: number
    public createdAt!: Date
    public updatedAt?: Date
}

export interface ForStoringProducts {
    retrieveAll(): StoredProduct[];
}
