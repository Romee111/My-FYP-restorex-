import express from "express";
import * as category from "./category.controller.js";
import subCategoryRouter from "../subcategory/subcategory.routes.js";
import {
  addCategoryValidation,
  deleteCategoryValidation,
  updateCategoryValidation,
} from "./category.validation.js";
import { validate } from "../../middlewares/validate.js";
import { uploadSingleFile } from "../../../multer/multer.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const categoryRouter = express.Router();

categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

categoryRouter
  .route("/addCategory")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("Image", "category"),
    validate(addCategoryValidation),
    category.addCategory
  );

categoryRouter.route("/getCategory/:id").get(category.getCategoryWithId);

categoryRouter.route("/getAllCategories").get(category.getAllCategories);

categoryRouter
  .route("/updateCategory/:id")
  .put(
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("Image", "category"),
   
    category.updateCategory
  );
categoryRouter
  .route("/deleteCategory/:id")
  .delete(
    protectedRoutes,
    allowedTo("admin"),
    validate(deleteCategoryValidation),
    category.deleteCategory
  );

export default categoryRouter;
