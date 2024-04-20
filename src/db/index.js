import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Database connected successfully, ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Connection failed", error);
        console.log(process.env.MONGODB_URI, DB_NAME);
        process.exit(1);
    }
}

export default connectDB;