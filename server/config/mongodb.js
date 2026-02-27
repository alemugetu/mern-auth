import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on("connected", () => { 
    console.log("MongoDB connected");
  });
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
