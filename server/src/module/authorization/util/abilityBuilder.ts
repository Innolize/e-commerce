import { Ability, AbilityBuilder, AbilityClass, InferSubjects, MongoQuery } from '@casl/ability'
import { Brand } from '../../brand/entity/Brand'
import { Product } from '../../product/entity/Product'
import { Role } from '../entities/Role'

export const actions = ['manage', 'create', 'read', 'delete', 'update'] as const
export type subjects = InferSubjects<typeof Product | typeof Brand, true>

export interface IAbility {
    action: typeof actions[number],
    subject: subjects
}

export type Abilities = [
    typeof actions[number],
    subjects
]

export type appAbility = Ability<Abilities>
const appAbility = Ability as AbilityClass<appAbility>

export const buildAbility = (role: Role): Ability<Abilities, MongoQuery> => {
    const { can, build } = new AbilityBuilder(appAbility)
    role.permissions?.map(permission => {
        can(permission.action, permission.subject, permission.condition)
    })
    return build()
}
