import { FullProcessor } from "../entities/FullProcessor"
import { Processor } from "../entities/Processor"
import { ProcessorModel } from "../model/ProcessorModel"
import { IProcessorCreate } from '../interface/IProcessorCreate'

export const fromDbToFullProcessor = (model: ProcessorModel): FullProcessor => {
    return new FullProcessor(model.toJSON() as FullProcessor)
}

export const fromDbToProcessor = (model: ProcessorModel): Processor => {
    return new Processor(model.toJSON() as IProcessorCreate)
}