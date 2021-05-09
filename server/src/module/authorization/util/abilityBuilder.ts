import { Ability, RawRuleOf, ForcedSubject, AbilityBuilder, AbilityClass, InferSubjects, subject } from '@casl/ability'
import { Product } from '../../product/entity/Product';
import { IProduct } from '../../product/interfaces/IProduct'
import { User } from '../../user/entities/User';
import { IBrand } from '../../brand/interfaces/IBrand';

export type actions = 'manage' | 'create' | 'read' | 'delete' | 'update';
export type subjects = InferSubjects<IProduct>

export type Abilities = [
    actions,
    subjects
    // typeof subjects[number] | ForcedSubject<Exclude<typeof subjects[number], 'All'>>
]

type appAbility = Ability<Abilities>
const appAbility = Ability as AbilityClass<appAbility>
export const builder = new AbilityBuilder(appAbility)

