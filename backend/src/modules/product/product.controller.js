import slugify from "slugify";
import { BASE_URL } from "../../../multer/multerConfiq.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne } from "../../handlers/factor.js";
import { productModel } from "./../../../Database/models/product.model.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

// //   try {
//     // If you're using file uploads (like with multer)
//     // req.body.imgCover = req.files.imgCover[0].filename;
//     // req.body.images = req.files.images.map((ele) => ele.filename);

//     req.body.slug = slugify(req.body.title);  // Create slug from title
//     const addProduct = new productModel(req.body);

//     // Save the new product
//     await addProduct.save();

//     // Send response
//     res.status(201).json({ message: "Product added successfully", addProduct });
//   } catch (error) {
//     next(error);  // Pass the error to the global error handler
//   }
// });
// const addProduct = catchAsyncError(async (req, res, next) => {
//   req.body.slug = slugify(req.body.title);
//   const addProduct = new productModel(req.body);

//   // Add this check to prevent errors
//   await addProduct.save();

//   // Send response
//   res.status(201).json({ message: "success", addProduct });
// });
const addProduct = async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.title);

    // Set createdBy to the currently logged-in user (seller/admin)
    req.body.createdBy = req.user._id; // Assuming req.user contains the logged-in user's details

    // // Set the imgCover path if it exists
    // if (req.file) {
    //   req.body.imgCover = `${BASE_URL}/uploads/products/${req.file.filename}`;
    // }

    // // Set the images paths if they exist
    // if (req.files && req.files.images) {
    //   req.body.images = req.files.images.map(file => `${BASE_URL}/uploads/products/${file.filename}`);
    // }

    const newProduct = await productModel.create(req.body);
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    next(error);
  }
};
const getSellerProducts = async (req, res, next) => {
  try {
    const sellerId = req.user._id; // The logged-in seller's ID
    const products = await productModel
      .find({ createdBy: sellerId })
      .populate("category")
      .populate("subcategory");

    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = catchAsyncError(async (req, res, next) => {
  console.log(req.query);
  const totalResults = await productModel.find().countDocuments();

  let apiFeature = new ApiFeatures(
    productModel
      .find()
      .sort({ updatedAt: -1 })
      .populate("category")
      .populate("subcategory"),
    req.query
  );
  // .pagination()
  // .limit()
  // .fields()
  // .filteration()
  // .search()
  // .sort();

  // Await the final mongoose query with all features applied
  const getAllProducts = await apiFeature.mongooseQuery;
  // console.log(getAllProducts);

  const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;

  res.status(201).json({
    page: PAGE_NUMBER,
    message: "success",
    getAllProducts,
    totalResults,
  });
});

const getSizesWithPrices = async (productId) => {
  try {
    // Fetch the product from the database
    const product = await productModel.findById(productId);

    if (!product) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    // Format sizes with their prices
    const sizesWithPrices = Object.entries(product.sizes).map(
      ([size, price]) => ({
        size,
        price,
      })
    );

    return {
      success: true,
      title: product.title,
      sizesWithPrices,
      createdBy: product.createdBy, // Optional: include the user who added the product
    };
  } catch (error) {
    return {
      success: false,
      message: `Error occurred: ${error.message}`,
    };
  }
};

const getProductsById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const getProductsById = await productModel.findById(id);
  res.status(201).json({ message: "success", getProductsById });
});

const newArrivals = catchAsyncError(async (req, res, next) => {
  const newArrivals = await productModel
    .find()
    .sort({ createdAt: -1 })
    .limit(4);
  res.status(201).json({ message: "success", newArrivals });
});

const getProducts = catchAsyncError(async (req, res, next) => {
  const getProducts = await productModel
    .find()
    .sort({ updatedAt: -1 })
    .populate("category")
    .populate("subcategory");
  res.status(201).json({ message: "success", getProducts });
});

const getSpecificProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const getSpecificProduct = await productModel.findByIdAndUpdate(id);
  res.status(201).json({ message: "success", getSpecificProduct });
});

const updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const updateProduct = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  updateProduct && res.status(201).json({ message: "success", updateProduct });

  !updateProduct && next(new AppError("Product was not found", 404));
});

const getProductsBySellerId = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  console.log(id, "Yooooooo");
  const getProductsBySellerId = await productModel.find({ createdBy: id });
  res.status(201).json({ message: "success", getProductsBySellerId });
});
const updateSellerProduct = async (req, res, next) => {
  try {
    const { _id: userId, role } = req.user; // Extract logged-in user's ID and role
    const productId = req.params.id;
    const updateData = req.body;

    // Find the product
    const product = await productModel.findById(productId);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has permission to update the product
    if (
      role === "admin" ||
      (role === "seller" && product.createdBy.toString() === userId.toString())
    ) {
      // Update the product
      const updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this product" });
    }
  } catch (error) {
    next(error);
  }
};
const deleteSellerProduct = async (req, res, next) => {
  try {
    const { _id: userId, role } = req.user; // Extract logged-in user's ID and role
    const productId = req.params.id;

    // Find the products
    const product = await productModel.findById(productId);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has permission to delete the product
    if (
      role === "admin" ||
      (role === "seller" && product.createdBy.toString() === userId.toString())
    ) {
      // Delete the product
      await productModel.findByIdAndDelete(productId);
      return res.status(200).json({ message: "Product deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this product" });
    }
  } catch (error) {
    next(error);
  }
};


const getCustomersByProductId = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const customers = await productModel.findById(id).populate('CreatedBy');
  res.status(201).json({ message: "success", customers });
});







// Add a review for a product
const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, reviewText } = req.body;
    const userId = req.user._id;
    const name = req.user.name;

    // Find the product by ID
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Add review to the product
    product.reviews.push({ user: userId, username: name, rating, reviewText });

    // Update the total rating and average rating
    product.totalRating += rating;
    product.rating = product.totalRating / product.reviews?.length;

    await product.save();

    res.status(201).json({ message: "Review added successfully.", product });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Error adding review. Please try again." });
  }
};
const deleteProduct = deleteOne(productModel, "Product");
export {
  addProduct,
  getAllProducts,
  getProducts,
  getSpecificProduct,
  updateProduct,
  deleteProduct,
  getProductsBySellerId,
  getProductsById,
   newArrivals,
   getSellerProducts,
   updateSellerProduct,
   deleteSellerProduct,
  getSizesWithPrices,
  getCustomersByProductId,
   addReview
   };



//   getProductsById,
//   newArrivals,
//   getSellerProducts,
//   updateSellerProduct,
//   deleteSellerProduct,
//   getSizesWithPrices,
//   addReview,
// ;

