import { FullCabinet } from "../entities/FullCabinet"
import { Cabinet } from "../entities/Cabinet"
import { CabinetModel } from "../model/CabinetModel"
import { ICabinetCreate } from '../interface/ICabinetCreate'

export const fromDbToFullCabinet = (model: CabinetModel): FullCabinet => {
    return new FullCabinet(model.toJSON() as FullCabinet)
}

export const fromDbToCabinet = (model: CabinetModel): Cabinet => {
    return new Cabinet(model.toJSON() as ICabinetCreate)
}