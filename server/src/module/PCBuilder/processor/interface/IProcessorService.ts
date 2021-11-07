import { GetProcessorDto } from "../dto/getProcessorsDto";
import { GetProcessorReqDto } from "../dto/getProcessorsReqDto";
import { Processor } from "../entities/Processor";
import { IProcessorCreate } from "./IProcessorCreate";
import { IProcessorEdit } from "./IProcessorEdit";

export interface IProcessorService {
    getAll: (queryParams: GetProcessorReqDto) => Promise<GetProcessorDto>
    getSingle: (id: number) => Promise<Processor>
    create: (newProcessor: IProcessorCreate) => Promise<Processor>
    modify: (id: number, processor: IProcessorEdit) => Promise<Processor>
    delete: (id: number) => Promise<true>
}