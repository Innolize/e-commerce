const CPU_BRANDS = ["INTEL", "AMD"];
const RAM_VERSION = ["DDR1", "DDR2", "DDR3", "DDR4"];
const SIZE = ["ATX", "Micro-ATX", "Mini-ATX"];
const DISK_TYPE = ["SSD", "HDD"];
const VIDEO_CARD_VERSION = ["DDR4", "DDR5", "DDR6"];
const PWS_CERTIFICATION = [
  "GENERIC",
  "PLUS",
  "PLUS SILVER",
  "PLUS GOLD",
  "PLUS PLATINUM",
];

export interface IBrand {
  id: string | number;
  name: string;
  logo: string;
}

export interface ICategory {
  id: string | number;
  name: string;
}

export interface IProduct {
  id: string | number;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: boolean;
  category: ICategory;
  brand: IBrand;
}

export interface IMotherboard {
  id: number;
  cpu_socket: string;
  cpu_brand: typeof CPU_BRANDS;
  ram_version: typeof RAM_VERSION;
  min_frec: number;
  max_frec: number;
  video_socket: string;
  model_size: typeof SIZE;
  watts: number;
  product?: IProduct;
}

export interface ICabinet {
  id: number;
  size: typeof SIZE;
  generic_pws: boolean;
  product?: IProduct;
}

export interface IRam {
  id: number;
  ram_version: typeof RAM_VERSION;
  memory: number;
  min_frec: number;
  max_frec: number;
  watts: number;
  product?: IProduct;
}

export interface IDiskStorage {
  id: number;
  total_storage: number;
  type: typeof DISK_TYPE;
  mbs: number;
  watts: number;
  product?: IProduct;
}

export interface IPowerSupply {
  id: number;
  watts: number;
  certification: typeof PWS_CERTIFICATION;
  product?: IProduct;
}

export interface IProcessor {
  id: number;
  cores: number;
  frecuency: number;
  socket: number;
  watts: number;
  product?: IProduct;
}

export interface IVideoCard {
  id: number;
  version: typeof VIDEO_CARD_VERSION;
  memory: number;
  clock_speed: number;
  watts: number;
  product?: IProduct;
}

export interface MotherboardForm {
  id?: string;
  cpu_socket: string;
  cpu_brand: string;
  ram_version: string;
  min_frec: string;
  max_frec: string;
  video_socket: string;
  model_size: string;
  watts: string;
}

export interface ProductForm {
  id?: string;
  name: string;
  description: string;
  image: string;
  price: string;
  stock: string;
  category: string;
  brand: string;
}
