import slugify from "slugify";
import { categoryModel } from "./../../../Database/models/category.model.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne } from "../../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const addCategory = catchAsyncError(async (req, res, next) => {
  // console.log(req.file);
  // req.body.Image = req.file.filename;
  req.body.slug = slugify(req.body.name);
  const addcategory = new categoryModel(req.body);
  await addcategory.save();

  res.status(201).json({ message: "success", addcategory });
});

const getCategoryWithId = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findById(id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({ message: "success", category });
});

const getAllCategories = catchAsyncError(async (req, res, next) => {
  let apiFeature = new ApiFeatures(
    categoryModel.find().sort({ updatedAt: -1 }),
    req.query
  )
    .pagination()
    .fields()
    .filteration()
    .search()
    .sort();
  const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;
  let getAllCategories = await apiFeature.mongooseQuery;
  // getAllCategories = getAllCategories.map((element)=>{
  //   element.Image = `http://localhost:3000/category/${element.Image}`
  //   return element
  // })

  res
    .status(201)
    .json({ page: PAGE_NUMBER, message: "success", getAllCategories });
});

const updateCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;
  const updateCategory = await categoryModel.findByIdAndUpdate(id, req.body, {
    
    new: true,
  });

  updateCategory &&
    res.status(201).json({ message: "success", updateCategory });

  !updateCategory && next(new AppError("category was not found", 404));
});

const deleteCategory = deleteOne(categoryModel, "category");
export {
  addCategory,
  getCategoryWithId,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
