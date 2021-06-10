import { CartItem } from "./CartItem";

export class Cart {
    constructor(
        public userId: number,
        public active: boolean,
        public cartItems?: CartItem[],
        public id?: number,
    ) { }
}