import * as yup from "yup";

const FILE_SIZE = 1024 * 1024; // 1048576B === 1MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

export const createBrandSchema = yup.object({
  name: yup
    .string()
    .required("Name is required.")
    .max(20, "Name length cannot be more than 20 characters"),
  logo: yup
    .mixed()
    .required("Logo for the brand is required")
    .test(
      "fileSize",
      "File size is too large",
      (value) => !value || value.size <= FILE_SIZE
    )
    .test(
      "fileType",
      "Unsupported file format",
      (value) => !value || SUPPORTED_FORMATS.includes(value.type)
    ),
});

export const editBrandSchema = yup.object({
  name: yup
    .string()
    .required("Name is required.")
    .max(20, "Name length cannot be more than 20 characters"),
  logo: yup
    .mixed()
    .test(
      "fileSize",
      "File size is too large",
      (value) => !value || value.size <= FILE_SIZE
    )
    .test(
      "fileType",
      "Unsupported file format",
      (value) => !value || SUPPORTED_FORMATS.includes(value.type)
    ),
});

export const createCategorySchema = yup.object({
  name: yup
    .string()
    .required("Name is required.")
    .max(20, "Name length cannot be more than 20 characters"),
});

export const editCategorySchema = yup.object({
  name: yup
    .string()
    .required("Name is required.")
    .max(20, "Name length cannot be more than 20 characters"),
});

export const createProductSchema = yup.object({
  name: yup
    .string()
    .required("Name is required.")
    .max(20, "Name length cannot have mor than 20 characters"),
  image: yup
    .mixed()
    .required("Image for the product is required.")
    .test(
      "fileSize",
      "File size is too large",
      (value) => !value || value.size <= FILE_SIZE
    )
    .test(
      "fileType",
      "Unsupported file format",
      (value) => !value || SUPPORTED_FORMATS.includes(value.type)
    ),
  description: yup
    .string()
    .required("Description is required.")
    .max(300, "Description length cannot have more than 300 characters"),
  price: yup.number().required("Price is required."),
  stock: yup.string().required("Stock is required."),
  brand: yup.string().required("Brand is required."),
  category: yup.string().required("Category is required."),
});

export const editProductSchema = yup.object({
  name: yup
    .string()
    .required("Name is required.")
    .max(20, "Name length cannot be more than 20 characters"),
  image: yup
    .mixed()
    .test(
      "fileSize",
      "File size is too large",
      (value) => !value || value.size <= FILE_SIZE
    )
    .test(
      "fileType",
      "Unsupported file format",
      (value) => !value || SUPPORTED_FORMATS.includes(value.type)
    ),
  description: yup
    .string()
    .required("Description is required.")
    .max(300, "Description length cannot have more than 300 characters"),
  price: yup.number().required("Price is required."),
  stock: yup.boolean().required("Stock is required."),
  id_category: yup.number().required("Category is required."),
  id_brand: yup.number().required("Brand is required."),
});
