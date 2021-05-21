/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { interpolation } from 'interpolate-json'
import { Permission } from '../../authorization/entities/Permission'
import { FullUser } from '../../user/entities/FullUser'


export const interpolatePermission = (permissions: Permission[], user: FullUser): Permission[] => {
    return permissions.map( permission => interpolation.expand(permission, user))
}