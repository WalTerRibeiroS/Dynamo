// ---- dependencias ------

import express from "express"
import type { Request, Response} from "express"
import cors from "cors"

// ---- importantes ------

import { corsOrigins } from "./config/cors.js"

// ---- rotas -----------

import testeRoute from "./modules/teste/route.test.js"

// ---- código ---------

const app = express()

app.use(express.json())
   .use(cors(corsOrigins))
  
   .use("/api/v1/teste", testeRoute)

   
//teste pra ver se o server ta vivo
app.get('/', (req: Request, res: Response) => {
  res.send('Olá');
});


export default app;