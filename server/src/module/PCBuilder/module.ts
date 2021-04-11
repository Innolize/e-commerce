import { Application } from 'express'
import { Container } from 'inversify'
import { TYPES } from '../../config/inversify.types'
import { MotherboardController } from './motherboard/module'

export function init(app: Application, container: Container): void {
    const motherboardController = container.get<MotherboardController>(TYPES.PCBuilder.Motherboard.Controller)
    const ramController = container.get<MotherboardController>(TYPES.PCBuilder.Ram.Controller)
    const processorController = container.get<MotherboardController>(TYPES.PCBuilder.Processor.Controller)
    const videoCardController = container.get<MotherboardController>(TYPES.PCBuilder.VideoCard.Controller)
    motherboardController.configureRoutes(app)
    ramController.configureRoutes(app)
    processorController.configureRoutes(app)
    videoCardController.configureRoutes(app)
}