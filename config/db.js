import mongoose from "mongoose";
import colors from 'colors'

export const db = async () => {
    try {
        const connection = await mongoose.connect(
            process.env.MONGO_URI /*,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }*/
        );
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(colors.cyan(`MongoDB Conectado en: ${url}`));
    } catch (error) {
        console.log(`Error: ${error}`)
        process.exit(1)
    }
}