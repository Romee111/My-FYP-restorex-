import express from "express";
import * as product from "./product.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
  addProductValidation,
  deleteProductValidation,
  getSpecificProductValidation,
  updateProductValidation,
   
} from "./product.validation.js";
import { uploadMultipleFiles, uploadSingleFile } from "../../../multer/multer.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const productRouter = express.Router();

let arrFields = [
  { name: "imgCover", maxCount: 1 },
  { name: "images", maxCount: 20 },
];

// Route to add a product
productRouter
  .route("/addProduct")
  .post(
    protectedRoutes,
    allowedTo("seller", "admin"),
    // Multiple files for images
    // validate(addProductValidation),
    product.addProduct
  );

// Route to get products by the logged-in seller


productRouter
.route("/getSellerProducts")
  .get(
    allowedTo("seller"),
    product.getSellerProducts
  );

// Route to get all products
productRouter
  .route("/getAllProducts")
  .get(product.getAllProducts);

// Route to get products by seller's ID
// productRouter
//   .route("/getProductBySellerId/:id")
//   .get(
//     allowedTo("seller"),
//     product.getproductBySellerId
//   );

// Route for new arrivals
productRouter
  .route("/newArrivals")
  .get(product.newArrivals);

// Route to get product by ID
productRouter
  .route("/getProductsById/:id")
  .get(product.getProductsById);

// Route to get all products
productRouter
  .route("/getProducts")
  .get(product.getProducts);

// Route to update product by ID
productRouter
  .route("/updateProduct/:id")
  .put(
    protectedRoutes,
    allowedTo("admin", "seller"),
    validate(updateProductValidation),
    product.updateProduct
  );

// Route to delete product by ID
productRouter
  .route("/deleteProduct/:id")
  .delete(
    protectedRoutes,
    allowedTo("admin", "seller"),
    validate(deleteProductValidation),
    product.deleteProduct
  );

// Route to get a specific product (validation added)
productRouter
  .route("/getSpecificProduct")
  .get(
    validate(getSpecificProductValidation),
    product.getSpecificProduct
  );

export default productRouter;
