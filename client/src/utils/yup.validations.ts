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
