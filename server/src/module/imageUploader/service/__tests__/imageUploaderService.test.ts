import 'reflect-metadata'
import { IImageUploadService } from '../../interfaces/IImageUploadService';
import { ImageUploadService } from '../imageUploaderService';
import { IImageUploadRepository } from '../../interfaces/IImageUploadRepository'
import { ImageUploaderError } from '../../error/imageUploaderError';

const repository: IImageUploadRepository = {
    deleteBrand: jest.fn(),
    deleteProduct: jest.fn(),
    uploadBrand: jest.fn(),
    uploadProduct: jest.fn()
}

const file = {
    fieldname: 'product_image',
    originalname: 'product.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer: Buffer.from('hellow world', 'utf-8'),
    size: 118057,
    destination: 'destination-test',
    filename: 'product.png',
    path: '/test'
} as Express.Multer.File

let service: IImageUploadService

beforeEach(() => {
    service = new ImageUploadService(repository)
});

afterEach(() => {
    jest.resetAllMocks()
});

describe('uploadProduct', () => {
    it('should call repository.uploadProduct once ', async () => {
        const FILENAME_EXTENSION = 'png'
        await service.uploadProduct(file)
        expect(repository.uploadProduct).toHaveBeenCalledWith(file.buffer, FILENAME_EXTENSION)
    });
});

describe('uploadBrand', () => {
    it('should call repository.uploadBrand once ', async () => {
        const FILENAME_EXTENSION = 'png'
        await service.uploadBrand(file)
        expect(repository.uploadBrand).toHaveBeenCalledWith(file.buffer, FILENAME_EXTENSION)
    });

    it('should throw if image has not extension', async () => {
        const INVALID_ORIGINAL_NAME = "invalid-filename"
        expect.assertions(1)
        try {
            await service.uploadBrand({ ...file, originalname: INVALID_ORIGINAL_NAME })
        } catch (err) {
            expect(err).toBeInstanceOf(ImageUploaderError)
        }


    })
});

describe('deleteProduct', () => {
    it('should call repository.deleteProduct once ', async () => {
        const MOCK_PRODUCT_URL = "www.test.com/product-image.png"
        const EXPECTED_DELETE_PRODUCT_PARAM = "product-image.png"
        await service.deleteProduct(MOCK_PRODUCT_URL)
        expect(repository.deleteProduct).toHaveBeenCalledWith(EXPECTED_DELETE_PRODUCT_PARAM)
    });
});

describe('deleteBrand', () => {
    it('should call repository.deleteBrand once ', async () => {
        const MOCK_BRAND_URL = "www.test.com/brand-image.png"
        const EXPECTED_DELETE_BRAND_PARAM = "brand-image.png"
        await service.deleteBrand(MOCK_BRAND_URL)
        expect(repository.deleteBrand).toHaveBeenCalledWith(EXPECTED_DELETE_BRAND_PARAM)
    });

    it('should throw if unexpected image url', async () => {
        const INVALID_FILEPATH = "invalid-filepath"
        expect.assertions(1)
        try {
            await service.deleteBrand(INVALID_FILEPATH)
        } catch (err) {
            expect(err).toBeInstanceOf(ImageUploaderError)
        }
    });
});