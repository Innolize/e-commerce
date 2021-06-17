import {
  IBrand,
  ICabinet,
  ICategory,
  IDiskStorage,
  IMotherboard,
  IPowerSupply,
  IProcessor,
  IProduct,
  IRam,
  IVideoCard,
} from "src/types";

export interface IGetBrands {
  count: number;
  results: IBrand[];
}

export interface IGetProducts {
  count: number;
  results: IProduct[];
}

export interface IGetCategories {
  count: number;
  results: ICategory[];
}

export interface IGetCabinets {
  count: number;
  results: ICabinet[];
}

export interface IGetRams {
  count: number;
  results: IRam[];
}

export interface IGetDiskStorages {
  count: number;
  results: IDiskStorage[];
}

export interface IGetProcessors {
  count: number;
  results: IProcessor[];
}

export interface IGetMotherboards {
  count: number;
  results: IMotherboard[];
}

export interface IGetVideoCards {
  count: number;
  results: IVideoCard[];
}

export interface IGetPowerSupplies {
  count: number;
  results: IPowerSupply[];
}
