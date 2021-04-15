import { Application } from 'express'
import { Container } from 'inversify'
import { TYPES } from '../../config/inversify.types'
import { CabinetController } from './cabinet/module'
import { DiskStorageController } from './disk-storage/module'
import { MotherboardController } from './motherboard/module'
import { PowerSupplyController } from './power-supply/module'
import { ProcessorController } from './processor/module'
import { RamController } from './ram/module'
import { VideoCardController } from './video-card/module'

export function init(app: Application, container: Container): void {
    const motherboardController = container.get<MotherboardController>(TYPES.PCBuilder.Motherboard.Controller)
    const ramController = container.get<RamController>(TYPES.PCBuilder.Ram.Controller)
    const processorController = container.get<ProcessorController>(TYPES.PCBuilder.Processor.Controller)
    const videoCardController = container.get<VideoCardController>(TYPES.PCBuilder.VideoCard.Controller)
    const cabinetController = container.get<CabinetController>(TYPES.PCBuilder.Cabinet.Controller)
    const powerSupplyController = container.get<PowerSupplyController>(TYPES.PCBuilder.PowerSupply.Controller)
    const diskStorageController = container.get<DiskStorageController>(TYPES.PCBuilder.DiskStorage.Controller)
    motherboardController.configureRoutes(app)
    ramController.configureRoutes(app)
    processorController.configureRoutes(app)
    videoCardController.configureRoutes(app)
    cabinetController.configureRoutes(app)
    powerSupplyController.configureRoutes(app)
    diskStorageController.configureRoutes(app)
}