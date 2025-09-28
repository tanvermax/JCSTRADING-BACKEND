
import express, { Request, Response } from "express"
import { router } from "./app/routes";
import cors from "cors";
import { globalErrorHandler } from "./app/middleware/globalerrorhandler";
import notFounde from "./app/middleware/notFounde";
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend-domain.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))
app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to PH BACKEND Database backend system"
    })
})

app.use(globalErrorHandler);

app.use(notFounde)

export default app;