import cors from "cors"
import express from "express"
import { router } from "./router"
import { errorHandlerMiddleware } from "./middlewares/error-handler"

const app = express()

app.use(cors())
app.use('/api', router)
app.use(errorHandlerMiddleware)

const PORT = 3000
app.listen(PORT, () => console.log(`Server initialized in http://localhost:${PORT}/`))