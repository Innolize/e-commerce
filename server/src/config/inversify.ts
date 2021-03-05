import { Container } from "inversify"
import { Sequelize } from "sequelize"
import { TYPES } from './inversify.types'

function configureDatabase() {
    return new Sequelize({ dialect: "postgres", storage: './data/database.db' })
}

const dependencyContainer = new Container({ defaultScope: "Singleton" })
dependencyContainer.bind<Sequelize>(TYPES.database).toConstantValue(configureDatabase())

// dependencyContainer.get<Sequelize>("database")


export default dependencyContainer