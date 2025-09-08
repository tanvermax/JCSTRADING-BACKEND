import { Server } from "http"
import mongoose from "mongoose";
import app from "./app"
import { envVarse } from "./app/config/env";
let server: Server;


const startserver = async () => {
    try {
        await mongoose.connect(envVarse.DB_URL)

        console.log("conneted to DATABASE");
        server = app.listen(envVarse.PORT, () => {
            console.log(`server is listening to port ${envVarse.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

startserver();





process.on("unhandledRejection", (err) => {
    console.log("Unhandle Rejection  Detected.. Server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
})


process.on("uncaughtException", (err) => {
    console.log("uncaughtException Rejection  Detected.. Server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
})


process.on("SIGTERM", (err) => {
    console.log("SIGTERM Signal  Detected.. Server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
})
