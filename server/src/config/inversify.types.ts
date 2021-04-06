export const TYPES = {
    Common: {
        Database: Symbol("Database"),
        UploadMiddleware: Symbol("UploadMiddleware"),
        ImageStorage: Symbol("ImageStorage")
    },
    Product: {
        Model: Symbol("ProductModel"),
        Repository: Symbol("ProductRepository"),
        Service: Symbol("ProductService"),
        Controller: Symbol("ProductController"),
    },
    Category: {
        Model: Symbol("CategoryModel"),
        Repository: Symbol("CategoryRepository"),
        Service: Symbol("CategoryService"),
        Controller: Symbol("CategoryController"),
    },
    Brand: {
        Model: Symbol("BrandModel"),
        Repository: Symbol("BrandRepository"),
        Service: Symbol("BrandService"),
        Controller: Symbol("BrandController"),
    },
    ImageUploader: {
        Service: Symbol("ImageUploaderService")
    },
    PCBuilder: {
        Motherboard: {
            Model: Symbol("MotherboardModel"),
            Repository: Symbol("MotherboardRepository"),
            Service: Symbol("MotherboardService"),
            Controller: Symbol("MotherboardController"),
        }
    }
}
