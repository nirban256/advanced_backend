import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path: "./env"
});

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log(`Error: ${error}`);
            throw error;
        });

        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        })
    })
    .catch((error) => {
        console.log("MongoDB Connection failed ", error);
    })

/*
// ifys - immediately invoked function expression
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    } catch (error) {
        console.error(error);
        throw new Error("Error while connecting to the database");
    }
})()
*/