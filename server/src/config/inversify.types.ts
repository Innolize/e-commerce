export const TYPES = {
    Common: {
        Database: Symbol("Database"),
        UploadMiddleware: Symbol("UploadMiddleware"),
        ImageStorage: Symbol("ImageStorage"),
        Encryption: Symbol("Encription")
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
        },
        Ram: {
            Model: Symbol("RamModel"),
            Repository: Symbol("RamRepository"),
            Service: Symbol("RamService"),
            Controller: Symbol("RamController")
        },
        Processor: {
            Model: Symbol('ProcessorModel'),
            Repository: Symbol('ProcessorRepository'),
            Service: Symbol('ProcessorService'),
            Controller: Symbol('ProcessorController'),
        },
        VideoCard: {
            Model: Symbol('VideoCardModel'),
            Repository: Symbol('VideoCardRepository'),
            Service: Symbol('VideoCardService'),
            Controller: Symbol('VideoCardController'),
        },
        Cabinet: {
            Model: Symbol('CabinetModel'),
            Repository: Symbol('CabinetRepository'),
            Service: Symbol('CabinetService'),
            Controller: Symbol('CabinetController'),
        },
        PowerSupply: {
            Model: Symbol('PowerSupplyModel'),
            Repository: Symbol('PowerSupplyRepository'),
            Service: Symbol('PowerSupplyService'),
            Controller: Symbol('PowerSupplyController'),
        },
        DiskStorage: {
            Model: Symbol('DiskStorageModel'),
            Repository: Symbol('DiskStorageRepository'),
            Service: Symbol('DiskStorageService'),
            Controller: Symbol('DiskStorageController'),
        }
    },
    User: {
        Model: Symbol('UserModel'),
        Repository: Symbol('UserRepository'),
        Service: Symbol('UserService'),
        Controller: Symbol('UserController'),
    },
    Auth: {
        // Service: Symbol('AuthService'),
        Controller: Symbol('AuthController'),
    },
}
