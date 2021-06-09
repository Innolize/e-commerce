import { CartItem } from "./CartItem";

export class Cart {
    constructor(
        public cartItem: CartItem[],
        public userId: number,
        public active: boolean,
        public id?: number,
    ) { }
}