import 'reflect-metadata'
import { init } from './module'
import { Container } from 'inversify'
import { mocked } from 'ts-jest/utils';
import { application } from 'express'
jest.mock('express')

const app = mocked(application, true)

const controller = {
    configureRoutes: jest.fn()
}
const container = {
    get: jest.fn(() => controller)
} as unknown as Container

describe('User module init', () => {
    it('should configure app ', () => {
        init(app, container)
        expect(container.get).toHaveBeenCalledTimes(1)
        expect(controller.configureRoutes).toHaveBeenCalledWith(app)
    });
});