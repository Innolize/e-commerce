import passport from "passport";

export const localAuthentication = passport.authenticate('local', { session: false })
export const jwtAuthentication = passport.authenticate('jwt', { session: false })