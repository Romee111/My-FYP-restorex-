import express from "express";
import * as subCategory from "./subcategory.controller.js";
import { validate } from "./../../middlewares/validate.js";
import {
  addSubCategoryValidation,
  deleteSubCategoryValidation,
  updateSubCategoryValidation,
} from "./subcategory.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter
  .route("/addSubCategory")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    validate(addSubCategoryValidation),
    subCategory.addSubCategory
  );
subCategoryRouter
  .route("/getAllSubCategories")
  .get(subCategory.getAllSubCategories);

subCategoryRouter
  .route("/getSubCategory/:id")
  .get(protectedRoutes, subCategory.getSubCategoryById);

subCategoryRouter
  .route("/updateSubCategory/:id")
  .put(
    protectedRoutes,
    allowedTo("admin"),
   
    subCategory.updateSubCategory
  );
subCategoryRouter
  .route("/deleteSubCategory/:id")
  .delete(
    protectedRoutes,
    allowedTo("admin"),
    validate(deleteSubCategoryValidation),
    subCategory.deleteSubCategory
  );

export default subCategoryRouter;
