// ---- dependencias ------

import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import helmet from "helmet"
import cookieParser from "cookie-parser"

// ---- importantes ------

import { corsOrigins } from './config/cors.js'
import errorMiddleware from './middlewares/error.js'
import morganMiddleware from './middlewares/morgan.js'
import { globalLimiter } from "./config/rateLimiter.js"

// ---- rotas -----------

import v1Router from "./routes/v1/index.js"

// ---- código ---------

const app = express()

app
  .set("trust proxy", 1)
  
  .use(express.json())
  .use(cors(corsOrigins))
  .use(helmet())
  .use(cookieParser())
  .use(morganMiddleware)

  .use(globalLimiter)
  .use("/api/v1", v1Router)

  .use(errorMiddleware)

//teste pra ver se o server ta vivo
app.get('/', (req: Request, res: Response) => {
  res.send('Olá')
})

export default app
