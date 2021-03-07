export interface IProduct {
    id?: number,
    name: string,
    brand: string,
    image: string | null,
    description: string | null,
    price: number,
    stock: boolean
}