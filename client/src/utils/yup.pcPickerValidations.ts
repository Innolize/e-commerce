import { CPU_BRANDS, DISK_TYPE, PWS_CERTIFICATION, RAM_VERSION, SIZE, VIDEO_CARD_VERSION } from "src/types";
import * as yup from "yup";

const FILE_SIZE = 1024 * 1024; // 1048576B === 1MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const productSchema = yup.object({
  name: yup
    .string()
    .required("Name is required.")
    .min(3, "Name length cannot be less than 3 characters.")
    .max(40, "Name length cannot have more than 40 characters"),
  image: yup
    .mixed()
    .test("fileSize", "File size is too large (1MB)", (value) => !value || value.size <= FILE_SIZE)
    .test("fileType", "Unsupported file format", (value) => !value || SUPPORTED_FORMATS.includes(value.type)),
  description: yup
    .string()
    .required("Description is required.")
    .min(3, "Description length cannot be less than 3 characters.")
    .max(100, "Description length cannot have more than 100 characters"),
  price: yup.number().min(1).max(10000000).required("Price is required."),
  stock: yup.boolean().required("Stock is required."),
  brand: yup.string().required("Brand is required."),
});

export const videoCardSchema = yup
  .object({
    version: yup.string().required("Version is required.").oneOf(VIDEO_CARD_VERSION),
    memory: yup.number().min(1).required("Memory is required."),
    clock_speed: yup.number().min(1).required("Clock speed is required."),
    watts: yup.number().min(1).required("Watts is required."),
  })
  .concat(productSchema);

export const cabinetSchema = yup
  .object({
    size: yup.string().oneOf(SIZE, "Wrong size provided.").required(),
    generic_pws: yup.boolean().required("Generic PWS is required"),
  })
  .concat(productSchema);

export const ramSchema = yup
  .object({
    min_frec: yup.number().min(1).required(),
    max_frec: yup.number().min(1).moreThan(yup.ref("min_frec"), "Max freq must be higher than min freq").required(),
    memory: yup.number().min(1).required(),
    ram_version: yup.string().oneOf(RAM_VERSION).required(),
    watts: yup.number().min(1).required(),
  })
  .concat(productSchema);

export const diskStorageSchema = yup
  .object({
    total_storage: yup.number().min(1).required(),
    type: yup.string().oneOf(DISK_TYPE).required(),
    mbs: yup.number().min(1).required(),
    watts: yup.number().min(1).required(),
  })
  .concat(productSchema);

export const motherboardSchema = yup
  .object({
    cpu_socket: yup.string().required(),
    cpu_brand: yup.string().oneOf(CPU_BRANDS).required(),
    ram_version: yup.string().oneOf(RAM_VERSION).required(),
    min_frec: yup.number().min(1).required(),
    max_frec: yup.number().min(1).moreThan(yup.ref("min_frec"), "Max freq must be higher than min freq").required(),
    video_socket: yup.string().required(),
    model_size: yup.string().oneOf(SIZE).required(),
    watts: yup.number().min(1).required(),
  })
  .concat(productSchema);

export const powerSupplySchema = yup
  .object({
    watts: yup.number().min(1).required(),
    certification: yup.string().oneOf(PWS_CERTIFICATION),
  })
  .concat(productSchema);

export const processorSchema = yup
  .object({
    cores: yup.number().min(1).required(),
    socket: yup.string().required(),
    frecuency: yup.number().min(1).required(),
    watts: yup.number().min(1).required(),
  })
  .concat(productSchema);
