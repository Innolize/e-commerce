import { PassportStatic } from 'passport'
import { Strategy as JwtStrategy, StrategyOptions, ExtractJwt } from 'passport-jwt'
import { User } from '../../user/entities/User';
import { UserService } from '../../user/module';

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
                const { password, ...userPasswordless } = user
                return done(null, userPasswordless)
            } catch (err) {
                return done(err, false)
            }

        }
    ))
}
