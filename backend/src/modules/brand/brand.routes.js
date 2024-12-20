import express from "express";
import * as brand from "./brand.controller.js";
import { validate } from "./../../middlewares/validate.js";
import {
  addBrandValidation,
  deleteBrandValidation,
  updateBrandValidation,
} from "./brand.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const brandRouter = express.Router();

brandRouter
  .route("/addBrand")
  .post(
    protectedRoutes,
    allowedTo("admin","seller"),
    validate(addBrandValidation),
    brand.addBrand
  )
  brandRouter
  .route("/getAllBrands")
  .get(brand.getAllBrands);

brandRouter
  .route("/updateBrand/:id")
  .put(
    protectedRoutes,
    allowedTo("admin","seller"),
    validate(updateBrandValidation),
    brand.updateBrand
  )
  brandRouter
  .route("/deleteBrand/:id")
  .delete(
    protectedRoutes,
    allowedTo("admin","seller"),
    validate(deleteBrandValidation),
    brand.deleteBrand
  );

export default brandRouter;
