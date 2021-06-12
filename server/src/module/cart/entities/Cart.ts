import { CartItem } from "./CartItem";

export class Cart {
    constructor(
        public user_id: number,
        public active: boolean = false,
        public cartItems?: CartItem[],
        public id?: number,
    ) { }
}