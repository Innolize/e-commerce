export const TYPES = {
    Common: {
        Database: Symbol("Database"),
        UploadMiddleware: Symbol("UploadMiddleware")
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
    }
}
