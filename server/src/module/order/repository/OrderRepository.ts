import { inject, injectable } from "inversify";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";

@injectable()
export class OrderRepository extends AbstractRepository {
    constructor(
    ) {
        super()
    }
}