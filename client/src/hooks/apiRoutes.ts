export const apiRoutes = {
  cabinet: {
    route: "/api/cabinet",
    cacheString: "cabinets",
  },
  ram: {
    route: "/api/ram",
    cacheString: "rams",
  },
  processor: {
    route: "/api/processor",
    cacheString: "processors",
  },
  "disk-storage": {
    route: "/api/disk-storage",
    cacheString: "disk_storage",
  },
  motherboard: {
    route: "/api/motherboard",
    cacheString: "motherboards",
  },
  "video-card": {
    route: "/api/video-card",
    cacheString: "video_card",
  },
  "power-supply": {
    route: "/api/power-supply",
    cacheString: "power_supply",
  },
  brand: {
    route: "/api/brand",
    cacheString: "brands",
  },
  category: {
    route: "/api/category",
    cacheString: "categories",
  },
  product: {
    route: "/api/product",
    cacheString: "products",
  },
  order: {
    route: "/api/order",
    cacheString: "orders",
  },
};

export type IApiRoutes =
  | "brand"
  | "video-card"
  | "product"
  | "category"
  | "motherboard"
  | "power-supply"
  | "disk-storage"
  | "processor"
  | "ram"
  | "cabinet"
  | "order";
