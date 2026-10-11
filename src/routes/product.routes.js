import { Router } from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

//hubungkan metode dan path ke controller 
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);

export default router;