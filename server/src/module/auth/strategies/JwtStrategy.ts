import { PassportStatic } from 'passport'
import { Strategy as JwtStrategy, StrategyOptions, ExtractJwt } from 'passport-jwt'
import { IUserWithAuthorization, PermissionRole } from '../../authorization/interfaces/IUserWithAuthorization';
import { buildAbility } from '../../authorization/util/abilityBuilder';
import { IUserRepository } from '../../user/interfaces/IUserRepository';
import { interpolatePermission } from '../util/interpolateJSON'

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: <string>process.env.JWT_SECRET,
    ignoreExpiration: false,
}

export function configureJwtStrategy(userRepository: IUserRepository, passport: PassportStatic): void {

    passport.use(new JwtStrategy(options,
        async (payload, done) => {
            try {
                const { sub: id } = payload
                const user = await userRepository.getSingleUser(Number(id))

                if (user.role?.permissions) {
                    const interpolatedPermissions = interpolatePermission(user.role.permissions, user)
                    user.role.permissions = interpolatedPermissions
                    const permissions = buildAbility(user.role)
                    console.log(permissions.rulesFor('read', 'User'))
                    const { password, ...rest } = user
                    const passwordlessUser = rest
                    const role: PermissionRole = { permissions, name: user.role.name }
                    const userWithAuthorization: IUserWithAuthorization = { ...passwordlessUser, role }
                    return done(null, userWithAuthorization)
                }
                return done(new Error('user permission not found'), false)
            } catch (err) {
                console.log(err.stack)
                return done(new Error('jwt'), false)
            }

        }
    ))
}
