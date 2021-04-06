import { Application } from 'express'
import { Container } from 'inversify'
import { TYPES } from '../../config/inversify.types'
import { MotherboardController } from './motherboard/module'

export function init(app: Application, container: Container): void {
    const motherboardController = container.get<MotherboardController>(TYPES.PCBuilder.Motherboard.Controller)
    motherboardController.configureRoutes(app)
}