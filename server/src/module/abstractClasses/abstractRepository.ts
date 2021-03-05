import { injectable } from 'inversify'
import { AbstractRepositoryError } from './abstractErrors/abstractRepositoryError'

@injectable()
export class AbstractRepository {
    constructor() {
        if (new.target === AbstractRepository) {
            throw new AbstractRepositoryError()
        }
    }
}