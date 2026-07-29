
import express from "express";

import {
  placeOrderCOD,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getDashboardData,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// ==========================================
// CUSTOMER
// ==========================================

// Place COD Order
orderRouter.post("/cod", placeOrderCOD);

// Get User Orders
orderRouter.get("/user", getUserOrders);


// ==========================================
// SELLER
// ==========================================

// Get All Orders
orderRouter.get("/seller", getAllOrders);

// Update Order Status
orderRouter.put("/status", updateOrderStatus);

// Seller Dashboard Data
orderRouter.get("/dashboard", getDashboardData);


export default orderRouter;

