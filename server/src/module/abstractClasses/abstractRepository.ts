import { AbstractRepositoryError } from './abstractErrors/abstractRepositoryError'

export class AbstractRepository {
    constructor() {
        if (new.target === AbstractRepository) {
            throw new AbstractRepositoryError()
        }
    }
}