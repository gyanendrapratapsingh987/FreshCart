import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cartRouter from "./routes/cartRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://freshcart-pi-six.vercel.app",
  "https://fresh-cart-five-theta.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman aur server-side requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Test API
app.get("/", (req, res) => {
  res.send("API is Working");
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Server Start Error:", error.message);
  }
};

startServer();