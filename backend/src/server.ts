import app from "./app.js"
import { ENV } from "./config/env.js"

app.listen(ENV.PORT, () => {
    console.log(`A manivele esta rodando na porta ${ENV.PORT}...`)
})