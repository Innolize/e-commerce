import express, { Response, Request } from "express"
import container from './config/inversify'
import { init } from "./module/product/module"
const app = express()
const port = 3000

init(app, container)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!! 123asd')
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})