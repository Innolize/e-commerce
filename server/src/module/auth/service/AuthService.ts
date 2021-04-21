import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { UserRepository } from "../../user/module";

@injectable()
export class AuthService extends AbstractService {
    private userRepository: UserRepository
    constructor(
        @inject(TYPES.User.Service) userRepository: UserRepository
    ) {
        super()
        this.userRepository = userRepository
    }

}