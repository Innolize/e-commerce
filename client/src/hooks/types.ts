import {
  IBrand,
  ICabinet,
  ICategory,
  IDiskStorage,
  IMotherboard,
  IOrder,
  IPowerSupply,
  IProcessor,
  IProduct,
  IRam,
  IVideoCard,
} from "src/types";

export interface IGetAllBrands {
  count: number;
  results: IBrand[];
}

export interface IGetAllProducts {
  count: number;
  results: IProduct[];
}

export interface IGetAllCategories {
  count: number;
  results: ICategory[];
}

export interface IGetAllCabinets {
  count: number;
  results: ICabinet[];
}

export interface IGetAllRams {
  count: number;
  results: IRam[];
}

export interface IGetAllDiskStorages {
  count: number;
  results: IDiskStorage[];
}

export interface IGetAllProcessors {
  count: number;
  results: IProcessor[];
}

export interface IGetAllMotherboards {
  count: number;
  results: IMotherboard[];
}

export interface IGetAllVideoCards {
  count: number;
  results: IVideoCard[];
}

export interface IGetAllPowerSupplies {
  count: number;
  results: IPowerSupply[];
}

export interface IGetAllOrders {
  count: number;
  results: IOrder[];
}
