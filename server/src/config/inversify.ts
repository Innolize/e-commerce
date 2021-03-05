import { Container } from "inversify"
import { Sequelize } from "sequelize"
import { TYPES } from './inversify.types'

function configureDatabase() {
    return new Sequelize(<string>process.env.DATABASE_URL, { logging: false, username: process.env.DATABASE_USERNAME, password: process.env.DATABASE_PASSWORD })
}

const dependencyContainer = new Container()
dependencyContainer.bind<Sequelize>(TYPES.database).toConstantValue(configureDatabase())


// dependencyContainer.get<Sequelize>("database")




export default dependencyContainer