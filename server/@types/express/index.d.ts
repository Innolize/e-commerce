import { IUserWithAuthorization } from "../../src/module/authorization/interfaces/IUserWithAuthorization";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Request {
      user: IUserWithAuthorization
    }
  }
}