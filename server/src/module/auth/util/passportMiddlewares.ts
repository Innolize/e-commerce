import passport from "passport";

export const localAuthentication = passport.authenticate('local', { session: false })