import {AbstractServiceError} from './abstractErrors/abstractServiceError'

export class AbstractService {
    constructor() {
        if (new.target === AbstractService) {
            throw new AbstractServiceError()
        }
    }
}