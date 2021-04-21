import "reflect-metadata";
import dotenv from 'dotenv'
dotenv.config()

import express, { Response, Request, NextFunction } from "express"
import container from './config/inversify'
import { init as initProductModule } from "./module/product/module"
import { init as initCategoryModule } from "./module/category/module"
import { init as initBrandModule } from "./module/brand/module"
import { init as initUserModule } from "./module/user/module"
import { init as initPCBuilderModule } from "./module/PCBuilder/module"
import { init as initAuth } from './module/auth/module'
import { MulterError } from "multer";
import { ReasonPhrases } from "http-status-codes";
import passport from "passport";
import { configureLocalStrategy } from "./module/auth/strategies/LocalStrategy";
import { TYPES } from "./config/inversify.types";

const app = express()
const port = process.env.PORT
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize())

//
initProductModule(app, container)
initCategoryModule(app, container)
initBrandModule(app, container)
initUserModule(app, container)
initPCBuilderModule(app, container)
initAuth(app, container)

configureLocalStrategy(container.get(TYPES.User.Repository), passport)




// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    return res.status(404).send({ "errors": ["Unexpected image field"] })
  }
  console.log(1234)
  return res.status(404).send(ReasonPhrases.NOT_FOUND)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function (req: Request, res: Response, next: NextFunction) {

  const method = req.method
  const route = req.originalUrl
  res.status(404).send({
    "method": method,
    "route": route,
    'error': "Route not found"
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})