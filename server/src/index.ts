import "reflect-metadata";
require('dotenv').config()
import express, { Response, Request } from "express"
import container, { configProductModel } from './config/inversify'
import { init } from "./module/product/module"
const app = express()
const port = process.env.PORT

console.log(configProductModel(container))

init(app, container)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!! 123asd')
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})