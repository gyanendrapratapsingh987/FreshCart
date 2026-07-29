import mongoose from "mongoose";
import dns from "dns";

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;