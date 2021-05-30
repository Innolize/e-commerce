import { Ability, AbilityBuilder, AbilityClass, InferSubjects, MongoQuery } from '@casl/ability'
import { Brand } from '../../brand/entity/Brand'
import { Category } from '../../category/entity/Category'
import { Cabinet } from '../../PCBuilder/cabinet/entities/Cabinet'
import { DiskStorage } from '../../PCBuilder/disk-storage/entities/DiskStorage'
import { Motherboard } from '../../PCBuilder/motherboard/entity/Motherboard'
import { PowerSupply } from '../../PCBuilder/power-supply/entities/PowerSupply'
import { Processor } from '../../PCBuilder/processor/entities/Processor'
import { Ram } from '../../PCBuilder/ram/entities/Ram'
import { VideoCard } from '../../PCBuilder/video-card/entities/VideoCard'
import { Product } from '../../product/entity/Product'
import { User } from '../../user/entities/User'
import { Role } from '../entities/Role'

export const actions = ['manage', 'create', 'read', 'delete', 'update'] as const
export const subjects = ['Product', 'Brand', 'Category', 'User', 'Cabinet', 'DiskStorage', 'Motherboard', 'PowerSupply', 'Processor', 'Ram', 'VideoCard', 'all' ] as const
export type subjects = InferSubjects<typeof Product | typeof Brand | typeof Category | typeof User | typeof Cabinet | typeof DiskStorage | typeof Motherboard | typeof PowerSupply | typeof Processor | typeof Ram | typeof VideoCard | 'all', true>

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
