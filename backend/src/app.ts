// ---- dependencias ------

import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'

// ---- importantes ------

import { corsOrigins } from './config/cors.js'
import errorMiddleware from './middlewares/error.js'
import morganMiddleware from './middlewares/morgan.js'

// ---- rotas -----------

import testeRoute from './modules/rotas_exeperimentais/route.js'

// ---- código ---------

const app = express()

app
  .use(express.json())
  .use(cors(corsOrigins))
  .use(morganMiddleware)

  .use('/api/v1/teste', testeRoute)

  .use(errorMiddleware)

//teste pra ver se o server ta vivo
app.get('/', (req: Request, res: Response) => {
  res.send('Olá')
})

export default app
