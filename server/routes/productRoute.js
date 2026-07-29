import express from "express";

import {
  addProduct,
  getProducts,
  changeStock,
  updateProduct,
} from "../controllers/productController.js";

import upload from "../configs/multer.js";

const productRouter = express.Router();


// ==========================================
// ADD PRODUCT
// ==========================================
productRouter.post(
  "/add",
  upload.array("images", 4),
  addProduct
);


// ==========================================
// GET PRODUCTS
// ==========================================
productRouter.get(
  "/list",
  getProducts
);


// ==========================================
// CHANGE STOCK
// ==========================================
productRouter.post(
  "/stock",
  changeStock
);


// ==========================================
// UPDATE PRODUCT + IMAGE
// ==========================================
productRouter.put(
  "/update",
  upload.array("images", 4),
  updateProduct
);


export default productRouter;