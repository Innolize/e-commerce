export interface ICreateProduct {
    id?: number;
    name: string;
    image: string | null;
    description: string | null;
    price: number;
    stock: boolean;
    id_category: number;
    id_brand: number
}