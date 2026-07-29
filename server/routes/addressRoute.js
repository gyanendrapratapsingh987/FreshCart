import express from "express";
import {
  addAddress,
  getAddress,
} from "../controllers/addressController.js";

const addressRouter = express.Router();

// Add new address
addressRouter.post("/add", addAddress);

// Get user's addresses
addressRouter.get("/get", getAddress);

export default addressRouter;