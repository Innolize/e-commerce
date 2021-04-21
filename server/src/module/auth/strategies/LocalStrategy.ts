import { PassportStatic } from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { UserRepository } from '../../user/module';
import { compare } from 'bcrypt'

export function configureLocalStrategy(User: UserRepository, passport: PassportStatic): void {
    passport.use(new LocalStrategy({ usernameField: 'mail' },
        async (mail, password, done) => {
            try {
                const user = await User.findUserByMail(mail)
                if (!user) {
                    return done(null, false, { message: "Incorrect mail" })
                }
                if (!await compare(password, user.password)) {
                    return done(null, false, { message: "Incorrect password" })
                }
                return done(null, user)
            } catch (err) {
                return done(err)
            }
        }
    ))
}