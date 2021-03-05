import { injectable } from 'inversify'
import { AbstractControllerError } from './abstractErrors/abstractControllerError'
@injectable()
export class AbstractController {
    constructor() {
        if (new.target === AbstractController) {
            throw new AbstractControllerError()
        }
    }
}