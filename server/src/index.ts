import "reflect-metadata";
import dotenv from 'dotenv'
dotenv.config()

import express, { Response, Request } from "express"
import container, { configProductModel } from './config/inversify'
import { init as initProductModule } from "./module/product/module"
import { init as initCategoryModule } from "./module/category/module"
import { init as initBrandModule } from "./module/brand/module"
const app = express()
const port = process.env.PORT
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
console.log(configProductModel(container))

initProductModule(app, container)
initCategoryModule(app, container)
initBrandModule(app, container)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!! 123asd')
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})