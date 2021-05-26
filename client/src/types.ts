export const CPU_BRANDS = ["INTEL", "AMD"];
export const RAM_VERSION = ["DDR1", "DDR2", "DDR3", "DDR4"];
export const SIZE = ["ATX", "Micro-ATX", "Mini-ATX"];
export const DISK_TYPE = ["SSD", "HDD"];
export const VIDEO_CARD_VERSION = ["DDR4", "DDR5", "DDR6"];
export const PWS_CERTIFICATION = [
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

type ErrorsObject = {
  prop: string;
};

export interface ServerError {
  message?: string | undefined;
  errors?: ErrorsObject[];
}
