import express from "express";
import * as review from "./review.controller.js";
import { validate } from "../../middlewares/validate.js";

import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
  addReviewValidation,
  deleteReviewValidation,
  getSpecificReviewValidation,
  updateReviewValidation,
} from "./review.validation.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/addReview")
  .post(
    protectedRoutes,
    allowedTo("user"),
    validate(addReviewValidation),
    review.addReview
  )

reviewRouter
  .route("/getAllReviews")
  .get(review.getAllReviews);

reviewRouter
  .route("/updateReview/:id")
  .put(
    protectedRoutes,
    allowedTo("user"),
    validate(updateReviewValidation),
    review.updateReview
  )
  reviewRouter
  .route("/getSpecificReview/:id")
  .get(
    
    validate(getSpecificReviewValidation), review.getSpecificReview)
  
  reviewRouter
  .route("/deleteReview/:id")
  .delete(
    protectedRoutes,
    allowedTo("admin", "user"),
    validate(deleteReviewValidation),
    review.deleteReview
  );

  reviewRouter
  .route("/getReviewsForProduct/:productId")
  .get(review.getReviewsForProduct);

export default reviewRouter;
