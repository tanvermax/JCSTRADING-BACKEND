
import express, { Request, Response } from "express"
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalerrorhandler";
import notFounde from "./app/middleware/notFounde";
const app = express();


app.use(express.json());


app.use("/api/v1",router)

app.get ("/",(req:Request,res:Response)=>{
    res.status(200).json({
        message:"Welcome to JCS Trading Database backend system"
    })
})

app.use(globalErrorHandler);

app.use(notFounde)

export default app;