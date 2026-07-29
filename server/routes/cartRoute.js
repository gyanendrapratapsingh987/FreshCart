import express from "express";

import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
} from "../controllers/cartController.js";

const cartRouter = express.Router();


// Add product
cartRouter.post("/add", addToCart);


// Get cart
cartRouter.get("/get", getCart);


// Update quantity
cartRouter.put("/update", updateCart);


// Remove product
cartRouter.delete("/remove", removeFromCart);


export default cartRouter;