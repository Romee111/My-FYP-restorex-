import slugify from "slugify";
import { BASE_URL } from "../../../multer/multerConfiq.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne } from "../../handlers/factor.js";
import { productModel } from "./../../../Database/models/product.model.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";


//   try {
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
    req.body.createdBy = req.user._id;  // Assuming req.user contains the logged-in user's details

    // // Set the imgCover path if it exists
    // if (req.file) {
    //   req.body.imgCover = `${BASE_URL}/uploads/products/${req.file.filename}`;
    // }

    // // Set the images paths if they exist
    // if (req.files && req.files.images) {
    //   req.body.images = req.files.images.map(file => `${BASE_URL}/uploads/products/${file.filename}`);
    // }

    const newProduct = await productModel.create(req.body);
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    next(error);
  }
};
const getSellerProducts = async (req, res, next) => {
  try {
    const sellerId = req.user._id; // The logged-in seller's ID
    const products = await productModel.find({ createdBy: sellerId });

    res.status(200).json({ message: "Products fetched successfully", products });
  } catch (error) {
    next(error);
  }
};


const getAllProducts = catchAsyncError(async (req, res, next) => {
  console.log(req.query);
  
  let apiFeature = new ApiFeatures(productModel.find(), req.query)
    .pagination()
    .limit()
    .fields()
    .filteration()
    .search()
    .sort();
  
  // Await the final mongoose query with all features applied
  const getAllProducts = await apiFeature.mongooseQuery;
  // console.log(getAllProducts);
  
  const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;

  res.status(201).json({ page: PAGE_NUMBER, message: "success", getAllProducts });
});

 const getProductsById=catchAsyncError(async(req,res,next)=>{
  const {id}=req.params
  const getProductsById=await productModel.findById(id)
  res.status(201).json({message:"success",getProductsById})
 })

const newArrivals=catchAsyncError(async(req,res,next)=>{
  const newArrivals=await productModel.find().sort({createdAt:-1}).limit(4);
  res.status(201).json({message:"success",newArrivals})  
});

const getProducts=catchAsyncError(async(req,res,next)=>{
  const getProducts=await productModel.find().populate('category').populate('subcategory');
  res.status(201).json({message:"success",getProducts})  
} 
    
)

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

const deleteProduct = deleteOne(productModel, "Product");
export {
  addProduct,
  getAllProducts,
  getProducts,
  getSpecificProduct,
  updateProduct,
  deleteProduct,

   getProductsById,
   newArrivals,
   getSellerProducts
};
