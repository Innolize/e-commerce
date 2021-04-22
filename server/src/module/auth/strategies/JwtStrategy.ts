import { PassportStatic } from 'passport'
import { Strategy as JwtStrategy, StrategyOptions, ExtractJwt } from 'passport-jwt'
import { User } from '../../user/entities/User';
import { UserRepository } from '../../user/module';

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: <string>process.env.JWT_SECRET,
    ignoreExpiration: false,
}

export function configureJwtStrategy(userRepository: UserRepository, passport: PassportStatic): void {

    passport.use(new JwtStrategy(options,
        async (payload, done) => {
            try {
                const { sub: id } = payload

                const user = await userRepository.getSingleUser(Number(id)) as User
                
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...userPasswordless } = user
                return done(null, userPasswordless)
            } catch (err) {
                return done(err, false)
            }

        }
    ))
}
