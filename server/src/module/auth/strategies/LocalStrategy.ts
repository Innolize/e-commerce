import { inject } from 'inversify'
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt'
import { TYPES } from '../../../config/inversify.types'
import { UserService } from '../../user/module'

const strategyOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "text-secret",
    ignoreExpiration: false
}
