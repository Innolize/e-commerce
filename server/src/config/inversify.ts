import { Container } from "inversify"
import { Sequelize } from "sequelize"
import { TYPES } from './inversify.types'

function configureDatabase() {
    return new Sequelize("postgres://localhost:5432/test", { logging: false, username: "postgres", password: "gor2rancio" })
}

const dependencyContainer = new Container()
dependencyContainer.bind<Sequelize>(TYPES.database).toConstantValue(configureDatabase())


// dependencyContainer.get<Sequelize>("database")


export default dependencyContainer