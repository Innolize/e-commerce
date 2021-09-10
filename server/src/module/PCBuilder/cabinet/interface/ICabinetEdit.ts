import { SIZE } from "../../../../config/constants/pcbuilder";

export interface ICabinetEdit {
    size?: typeof SIZE[number],
    generic_pws?: boolean,
}