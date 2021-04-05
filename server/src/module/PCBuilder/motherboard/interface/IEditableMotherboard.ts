import { IMotherboard } from "./IMotherboard";

export interface IEditableMotherboard extends Partial<IMotherboard> {
    id: number
}