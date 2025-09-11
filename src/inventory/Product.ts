export class Product {
    private id: string
    private name: string
    private description: string
    private sku: string
    private stock: number
    private minStock: number
    private createdAt: Date
    private updatedAt: Date | undefined


    constructor(id: string, name: string, description: string, sku: string, stock: number, minStock: number, createdAt: Date, updatedAt?: Date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sku = sku;
        this.stock = stock;
        this.minStock = minStock;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
