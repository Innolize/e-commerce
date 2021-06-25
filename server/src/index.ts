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
import { init as initCart } from './module/cart/module'
import { MulterError } from "multer";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import { configurePassportStrategies } from "./module/auth/strategies";
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { BaseError } from "./module/common/error/BaseError";
import { ValidationError } from "joi";
import cors from "cors"

const app = express()
const port = process.env.PORT
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize())
configurePassportStrategies(container, passport)
initProductModule(app, container)
initCategoryModule(app, container)
initBrandModule(app, container)
initUserModule(app, container)
initPCBuilderModule(app, container)
initAuth(app, container)
initCart(app, container)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({ errors: err.message })
  }
  if (err instanceof BaseError) {
    return res.status(err.httpCode).send({ error: err.message })
  }
  if (err instanceof MulterError) {
    return res.status(404).send({ error: err.message })
  }
  console.log(err.stack)
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: err.message })
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