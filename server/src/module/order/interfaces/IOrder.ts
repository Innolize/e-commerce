export interface IOrderItem {
    product_id: number,
    quantity: number,
    price_per_unit: number,
    total: number,
    id?: number,
}

export interface IOrder {
    user_id: number,
    payment_id: number
    id?: number,
    cartItems?: IOrderItem[],
    payment: IPayment
}

export interface IPayment{
    order_id: number,
    amount: number,
    status: "PENDING" | "PAID"
}