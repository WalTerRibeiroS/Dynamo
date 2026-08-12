import { Router } from "express"

import { teste } from "./controller.test.js"

const router = Router()

router.post("/mudar", teste)

export default router