import 'reflect-metadata'
import { init } from './module'
import { application } from 'express'
import { mocked } from 'ts-jest/utils';
import { Container } from 'inversify'
import { TYPES } from '../../config/inversify.types';

const app = mocked(application, true)
const routes = {
    configureRoutes: jest.fn()
}
const container = {
    get: jest.fn(() => {
        return routes
    })
} as unknown as Container

describe('module', () => {
    it('should call container.get once and controller.configureRoutes ', async () => {
        init(app, container)
        expect(container.get).toHaveBeenCalledTimes(1)
        expect(container.get).toHaveBeenCalledWith(TYPES.Brand.Controller)
        expect(routes.configureRoutes).toHaveBeenCalledTimes(1)
        expect(routes.configureRoutes).toHaveBeenCalledWith(app)
    });

});