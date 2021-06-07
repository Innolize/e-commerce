/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { interpolation } from 'interpolate-json'
import { Permission } from '../../authorization/entities/Permission'
import { User } from '../../user/entities/User'


export const interpolatePermission = (permissions: Permission[], user: User): Permission[] => {
    return permissions.map( permission => interpolation.expand(permission, user))
}