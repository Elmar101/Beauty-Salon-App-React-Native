import mongoose from "mongoose";

const DB_URL =
  " mongodb+srv://elfrontend10:TZP2k1BcqL4MhPrv@cluster0.tigjay1.mongodb.net/beauty-salon?retryWrites=true&w=majority&appName=Cluster0";
export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI! || DB_URL);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

