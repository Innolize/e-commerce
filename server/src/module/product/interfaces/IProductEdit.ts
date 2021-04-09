export interface IProductEdit {
    id?: number,
    name?: string,
    id_brand?: number,
    image?: string | null,
    description?: string | null,
    price?: number,
    stock?: boolean
    id_category?: number
}