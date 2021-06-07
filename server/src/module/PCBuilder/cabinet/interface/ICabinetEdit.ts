import { SIZE } from "../../../../config/constants/pcbuilder";
import { ICabinetCreate } from "./ICabinetCreate";


export interface ICabinetEdit {
    size?: typeof SIZE[number],
    generic_pws?: boolean,
}