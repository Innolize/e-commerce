export interface IProduct {
    id?: number;
    name: string;
    image: string | null;
    description: string | null;
    price: number;
    stock: boolean;
    category?: number;
    brand?: number;
}