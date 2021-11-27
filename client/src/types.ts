export const CPU_BRANDS = ["INTEL", "AMD"];
export const RAM_VERSION = ["DDR1", "DDR2", "DDR3", "DDR4"];
export const SIZE = ["ATX", "Micro-ATX", "Mini-ATX"];
export const DISK_TYPE = ["SSD", "HDD"];
export const VIDEO_CARD_VERSION = ["DDR4", "DDR5", "DDR6"];
export const PWS_CERTIFICATION = ["GENERIC", "PLUS", "PLUS SILVER", "PLUS GOLD", "PLUS PLATINUM"];
export const PAYMENT_TYPE = ["CASH", "DEBIT CARD", "CREDIT CARD", "MERCADOPAGO"];
export const PAYMENT_STATUS = ["PAID", "PENDING"] as const;

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
  cpuSocket: string;
  cpuBrand: typeof CPU_BRANDS[number];
  ramVersion: typeof RAM_VERSION[number];
  minFrec: number;
  maxFrec: number;
  videoSocket: string;
  modelSize: typeof SIZE[number];
  watts: number;
  product: IProduct;
}

export interface ICabinet {
  id: number;
  size: typeof SIZE[number];
  genericPws: boolean | string;
  product?: IProduct;
}

export interface IRam {
  id: number;
  ramVersion: typeof RAM_VERSION[number];
  memory: number;
  minFrec: number;
  maxFrec: number;
  watts: number;
  product: IProduct;
}

export interface IDiskStorage {
  id: number;
  totalStorage: number;
  type: typeof DISK_TYPE[number];
  mbs: number;
  watts: number;
  product?: IProduct;
}

export interface IPowerSupply {
  id: number;
  watts: number;
  certification: typeof PWS_CERTIFICATION[number];
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
  version: typeof VIDEO_CARD_VERSION[number];
  memory: number;
  clockSpeed: number;
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

export interface ICartItem {
  id: number;
  cartId: number;
  productId: number;
  product: IProduct;
  quantity: number;
}

export interface ICart {
  userId: number;
  id: number;
  cartItems: ICartItem[] | [];
}

export interface IUserInfo {
  id: number;
  mail: string;
  roleId: number;
  cart: {
    userId: number;
    id: number;
  };
}

export interface IUser {
  userInfo: IUserInfo;
  accessToken: string;
}

export interface IOrderItem {
  id: number;
  orderId: number;
  pricePerUnit: number;
  product: IProduct;
  productId: number;
  quantity: number;
  total: number;
}

export interface IOrder {
  id: number;
  orderItems: IOrderItem[];
  payment: {
    amount: number;
    id: number;
    orderId: number;
    status: typeof PAYMENT_STATUS[number];
    type: typeof PAYMENT_TYPE[number];
  };
  user_id: number;
}

export interface IServerUserResponse {
  user: {
    id: number;
    mail: string;
    role_id: number;
    cart: {
      user_id: number;
      id: number;
    };
  };
  access_token: string;
}

export interface IServerCartResponse {
  user_id: number;
  id: number;
  cart_items:
    | {
        id: number;
        cart_id: number;
        product_id: number;
        product: IProduct;
        quantity: number;
      }[]
    | [];
}
