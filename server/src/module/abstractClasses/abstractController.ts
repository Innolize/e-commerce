import { AbstractControllerError } from './abstractErrors/abstractControllerError'
export class AbstractController {
    constructor() {
        if (new.target === AbstractController) {
            throw new AbstractControllerError()
        }
    }
}