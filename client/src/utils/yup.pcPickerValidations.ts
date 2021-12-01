import { CPU_BRANDS, DISK_TYPE, PWS_CERTIFICATION, RAM_VERSION, SIZE, VIDEO_CARD_VERSION } from "src/types";
import * as yup from "yup";

export const videoCardSchema = yup.object({
  version: yup.string().required("Version is required.").oneOf(VIDEO_CARD_VERSION),
  memory: yup.number().min(1).required("Memory is required."),
  clock_speed: yup.number().min(1).required("Clock speed is required."),
  watts: yup.number().min(1).required("Watts is required."),
});

export const cabinetSchema = yup.object({
  size: yup.string().oneOf(SIZE, "Wrong size provided.").required(),
  generic_pws: yup.boolean().required("Generic PWS is required"),
});

export const ramSchema = yup.object({
  min_frec: yup.number().min(1).required(),
  max_frec: yup.number().min(1).moreThan(yup.ref("min_frec"), "Max freq must be higher than min freq").required(),
  memory: yup.number().min(1).required(),
  ram_version: yup.string().oneOf(RAM_VERSION).required(),
  watts: yup.number().min(1).required(),
});

export const diskStorageSchema = yup.object({
  total_storage: yup.number().min(1).required(),
  type: yup.string().oneOf(DISK_TYPE).required(),
  mbs: yup.number().min(1).required(),
  watts: yup.number().min(1).required(),
});

export const motherboardSchema = yup.object({
  cpu_socket: yup.string().required(),
  cpu_brand: yup.string().oneOf(CPU_BRANDS).required(),
  ram_version: yup.string().oneOf(RAM_VERSION).required(),
  min_frec: yup.number().min(1).required(),
  max_frec: yup.number().min(1).moreThan(yup.ref("min_frec"), "Max freq must be higher than min freq").required(),
  video_socket: yup.string().oneOf(VIDEO_CARD_VERSION).required(),
  model_size: yup.string().oneOf(SIZE).required(),
  watts: yup.number().min(1).required(),
});

export const powerSupplySchema = yup.object({
  watts: yup.number().min(1).required(),
  certification: yup.string().oneOf(PWS_CERTIFICATION),
});

export const processorSchema = yup.object({
  cores: yup.number().min(1).required(),
  socket: yup.string().required(),
  frecuency: yup.number().min(1).required(),
  watts: yup.number().min(1).required(),
});
