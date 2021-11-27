import { PassportStatic } from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { compare } from 'bcrypt'
import { IUserRepository } from '../../user/interfaces/IUserRepository';

export function configureLocalStrategy(userRepository: IUserRepository, passport: PassportStatic): void {
    passport.use(new LocalStrategy({ usernameField: 'mail' },
        async (mail, password, done) => {
            try {
                const user = await userRepository.findUserByMail(mail)
                if (!user) {
                    return done(null, false, { message: "Incorrect mail" })
                }
                if (!await compare(password, user.password)) {
                    return done(null, false, { message: "Incorrect password" })
                }
                return done(null, user)
            } catch (err) {
                console.log(err)
                return done(err)
            }
        }
    ))
}