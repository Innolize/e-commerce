export interface IGeneralProductForm {
  id?: string;
  name: string;
  description: string;
  image: string;
  price: string;
  stock: string;
  category: string;
  brand: string;
}

export interface IProductForm {
  product_id?: string;
  name: string;
  description: string;
  image: string;
  price: string;
  stock: string;
  category: string;
  brand: string;
}

export interface IMotherboardForm {
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

export interface ICabinetForm {
  id?: string;
  size: string;
  generic_pws: string;
}

export interface IRamForm {
  id?: string;
  ram_version: string;
  memory: string;
  min_frec: string;
  max_frec: string;
  watts: string;
}

export interface IDiskStorageForm {
  id?: string;
  total_storage: string;
  type: string;
  mbs: string;
  watts: string;
}

export interface IPowerSupplyForm {
  id?: string;
  watts: string;
  certification: string;
}

export interface IProcessorForm {
  id?: string;
  cores: string;
  frecuency: string;
  socket: string;
  watts: string;
}

export interface IVideoCardForm {
  id?: string;
  version: string;
  memory: string;
  clock_speed: string;
  watts: string;
}
