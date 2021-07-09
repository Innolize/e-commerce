import { Request, NextFunction, Response } from 'express'
import { IUserWithAuthorization } from '../interfaces/IUserWithAuthorization'
import { IAbility } from './abilityBuilder'

export const authorizationMiddleware = (permission: IAbility): (req: Request, res: Response, next: NextFunction) => void => {
    const { action, subject } = permission
    return function (req: Request, res: Response, next: NextFunction): void {
        const user = req?.user as IUserWithAuthorization
        if (!user) {
            return next(new Error('Unauthorized role'))

        }
        if (user.role.permissions.can(action, subject)) {
            return next()

        }
        return next(new Error(`You dont have enough permissions to ${action} this ${subject}!`))
    }
}