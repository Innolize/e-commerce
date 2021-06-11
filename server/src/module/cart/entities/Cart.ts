import { CartItem } from "./CartItem";

export class Cart {
    constructor(
        public userId: number,
        public active: boolean = false,
        public cartItems?: CartItem[],
        public id?: number,
    ) { }
}