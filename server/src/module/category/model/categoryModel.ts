import { injectable } from "inversify";
import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { ICategory } from "../interfaces/ICategory";

// decorate(injectable(), (Model))

@injectable()
export class CategoryModel extends Model<ICategory> implements ICategory {
    id?: number | undefined;
    name: string;

    static setup(database: Sequelize): typeof CategoryModel {
        CategoryModel.init({
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    min: 3,
                    max: 20
                }
            }
        }, {
            sequelize: database,
            modelName: "Category",
        })
        return CategoryModel
    }

}