import { PassportStatic } from 'passport'
import { Strategy as JwtStrategy, StrategyOptions, ExtractJwt } from 'passport-jwt'
import { IUserWithAuthorization } from '../../authorization/interfaces/IUserWithAuthorization';
import { buildAbility } from '../../authorization/util/abilityBuilder';
import { User } from '../../user/entities/User';
import { UserService } from '../../user/module';
import { interpolatePermission } from '../util/interpolateJSON'

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: <string>process.env.JWT_SECRET,
    ignoreExpiration: false,
}

export function configureJwtStrategy(userService: UserService, passport: PassportStatic): void {

    passport.use(new JwtStrategy(options,
        async (payload, done) => {
            try {
                const { sub: id } = payload
                const user = await userService.getSingleUser(Number(id)) as User
                if (user.role?.permissions) {
                    const permissions = interpolatePermission(user.role.permissions, user)
                    user.role.permissions = permissions
                    const role = buildAbility(user.role)
                    const { password, ...rest } = user
                    const passwordlessUser = rest
                    const userWithAuthorization: IUserWithAuthorization = { ...passwordlessUser, role }
                    return done(null, userWithAuthorization)
                }
                return done(new Error('user permission not found'), false)
            } catch (err) {
                return done(new Error('jwt'), false)
            }

        }
    ))
}
