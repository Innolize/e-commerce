import { IPayment } from "./IPayment";

export type IPaymentCreate = Omit<IPayment, "id" | "status">