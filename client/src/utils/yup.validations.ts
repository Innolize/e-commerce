import * as yup from "yup";

const FILE_SIZE = 1024 * 1024; // 1048576B === 1MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

export const createBrandSchema = yup.object({
  name: yup.string().required("Name is required.").max(20, "Name length cannot be more than 20 characters"),
  logo: yup
    .mixed()
    .required("Logo for the brand is required")
    .test("fileSize", "File size is too large", (value) => !value || value.size <= FILE_SIZE)
    .test("fileType", "Unsupported file format", (value) => !value || SUPPORTED_FORMATS.includes(value.type)),
});

export const editBrandSchema = yup.object({
  name: yup.string().required("Name is required.").max(20, "Name length cannot be more than 20 characters"),
  logo: yup
    .mixed()
    .test("fileSize", "File size is too large", (value) => !value || value.size <= FILE_SIZE)
    .test("fileType", "Unsupported file format", (value) => !value || SUPPORTED_FORMATS.includes(value.type)),
});

export const createCategorySchema = yup.object({
  name: yup.string().required("Name is required.").max(20, "Name length cannot be more than 20 characters"),
});

export const editCategorySchema = yup.object({
  name: yup.string().required("Name is required.").max(20, "Name length cannot be more than 20 characters"),
});

export const createProductSchema = yup.object({
  name: yup
    .string()
    .required("Name is required.")
    .min(3, "Name length cannot be less than 3 characters.")
    .max(40, "Name length cannot have more than 40 characters"),
  image: yup
    .mixed()
    .required("Image for the product is required.")
    .test("fileSize", "File size is too large", (value) => !value || value.size <= FILE_SIZE)
    .test("fileType", "Unsupported file format", (value) => !value || SUPPORTED_FORMATS.includes(value.type)),
  description: yup
    .string()
    .required("Description is required.")
    .min(3, "Description length cannot be less than 3 characters.")
    .max(100, "Description length cannot have more than 100 characters"),
  price: yup.number().min(1).max(10000000).required("Price is required."),
  stock: yup.bool().required("Stock is required."),
  brand: yup.string().required("Brand is required."),
  category: yup.string().required("Category is required."),
});

export const editProductSchema = yup.object({
  name: yup
    .string()
    .required("Name is required.")
    .min(3, "Name length cannot be less than 3 characters.")
    .max(40, "Name length cannot be more than 40 characters"),
  image: yup
    .mixed()
    .test("fileSize", "File size is too large (1 MB)", (value) => !value || value.size <= FILE_SIZE)
    .test("fileType", "Unsupported file format", (value) => !value || SUPPORTED_FORMATS.includes(value.type)),
  description: yup
    .string()
    .required("Description is required.")
    .min(3, "Description length cannot be less than 3 characters.")
    .max(100, "Description length cannot have more than 100 characters"),
  price: yup.number().min(1).max(10000000).required("Price is required."),
  stock: yup.boolean().required("Stock is required."),
  category: yup.number().required("Category is required."),
  brand: yup.number().required("Brand is required."),
});
