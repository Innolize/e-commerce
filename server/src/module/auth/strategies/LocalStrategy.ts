import passport, { PassportStatic } from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { UserRepository } from '../../user/module';
import { compare } from 'bcrypt'

export function configureLocalStrategy(User: UserRepository, passport: PassportStatic): void {
    passport.use(new LocalStrategy({ usernameField: 'mail' },
        async (mail, password, done) => {
            try {
                const user = await User.findUserByMail(mail)
                if (!user) {
                    console.log('12')
                    return done(null, false, { message: "Incorrect mail" })
                }
                if (!await compare(password, user.password)) {

                    console.log('16')
                    return done(null, false, { message: "Incorrect password" })
                }
                console.log('19')
                return done(null, user)
            } catch (err) {
                console.log('22')
                return done(err)
            }
        }
    ))
}