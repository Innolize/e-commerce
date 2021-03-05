import { injectable } from 'inversify'
import { AbstractServiceError } from './abstractErrors/abstractServiceError'

@injectable()
export class AbstractService {
    constructor() {
        if (new.target === AbstractService) {
            throw new AbstractServiceError()
        }
    }
}