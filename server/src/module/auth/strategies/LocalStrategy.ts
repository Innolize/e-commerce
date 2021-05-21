import { PassportStatic } from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { UserService } from '../../user/module';
import { compare } from 'bcrypt'

export function configureLocalStrategy(userService: UserService, passport: PassportStatic): void {
    passport.use(new LocalStrategy({ usernameField: 'mail' },
        async (mail, password, done) => {
            try {
                const user = await userService.findUserByMail(mail)
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