import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// import { LIMIT } from "./constants.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));  // adding the url from which the client will be able to talk to the server. This is a security feature to prevent unauthorized access to the server.

app.use(express.json({ limit: "500kb" })); // to limit the amount of data that can be sent to the server.
app.use(express.urlencoded({
    extended: true,
    limit: "500kb"
})); // urlencoded is used to parse the url data sent to the server from the client. extended: true allows for nested objects in the data.

app.use(express.static("public"));  // it is used to keep and serve the static files from the public folder present in the root directory.

app.use(cookieParser());  // using this I can do crud operation on the cookies present in the client's browser.


// import routes
import userRouter from "./routes/user.routes.js";

// making routes
app.use("/api/v1/users", userRouter);  // whenever we go the "/api/v1/users" route, then  the user will be sent to the userRouter and the url will be "/api/v1/users/register".

export default app;