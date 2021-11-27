import 'reflect-metadata'
import { S3 } from 'aws-sdk'
import { ImageUploadRepository } from '../imageUploadRepository'
import { v4 } from 'uuid'
import { PutObjectRequest } from 'aws-sdk/clients/s3'

jest.mock('uuid', () => {
    return {
        v4: jest.fn(() => V4_RETURN_VALUE)
    }
})

//uuid mock
const V4_RETURN_VALUE = "v4-test-value"
const mockV4 = v4 as jest.MockedFunction<typeof v4>

//image mock
const MOCK_BUFFER = Buffer.from("test")
const MOCK_NAME = 'test'

//enviroment variable
const ENVIROMENT_VARIABLE = {
    AWS_BUCKET: "AWS_BUCKET_NAME"
}

//S3 mock
jest.mock('aws-sdk', () => {
    return {
        S3: jest.fn(() => S3Instance)
    }
})
const S3Instance = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn(),
    deleteObject: jest.fn().mockReturnThis()
}

const imageStore = new S3()
let repository: ImageUploadRepository

beforeAll(() => {
    process.env = { ...ENVIROMENT_VARIABLE }
    repository = new ImageUploadRepository(imageStore)
});

afterEach(() => {
    jest.clearAllMocks()
});

afterAll(() => {
    delete process.env.AWS_BUCKET
});

describe('uploadProduct', () => {
    it('should call imageRepository with right params', async () => {
        await repository.uploadProduct(MOCK_BUFFER, MOCK_NAME)

        const EXPECTED_UPLOAD_PARAMS: PutObjectRequest = {
            Body: MOCK_BUFFER,
            Bucket: ENVIROMENT_VARIABLE.AWS_BUCKET,
            Key: `PRODUCT/${V4_RETURN_VALUE}.test`
        }

        expect(mockV4).toHaveBeenCalledTimes(1)
        expect(S3Instance.upload).toHaveBeenCalledTimes(1)
        expect(S3Instance.upload).toBeCalledWith(EXPECTED_UPLOAD_PARAMS)
        expect(S3Instance.promise).toHaveBeenCalledTimes(1)
    });
});

describe('uploadBrand', () => {
    it('should upload brand image with given params', async () => {
        await repository.uploadBrand(MOCK_BUFFER, MOCK_NAME)

        const EXPECTED_UPLOAD_PARAMS: PutObjectRequest = {
            Body: MOCK_BUFFER,
            Bucket: ENVIROMENT_VARIABLE.AWS_BUCKET,
            Key: `BRAND/${V4_RETURN_VALUE}.test`
        }
        expect(mockV4).toHaveBeenCalledTimes(1)
        expect(S3Instance.upload).toHaveBeenCalledTimes(1)
        expect(S3Instance.upload).toBeCalledWith(EXPECTED_UPLOAD_PARAMS)
        expect(S3Instance.promise).toHaveBeenCalledTimes(1)
    });
});

describe('deleteProduct', () => {
    it('should delete product image with given params ', async () => {
        await repository.deleteProduct(MOCK_NAME)

        const EXPECTED_DELETE_PARAMS: PutObjectRequest = {
            Bucket: ENVIROMENT_VARIABLE.AWS_BUCKET,
            Key: `PRODUCT/${MOCK_NAME}`
        }
        expect(S3Instance.deleteObject).toHaveBeenCalledTimes(1)
        expect(S3Instance.deleteObject).toBeCalledWith(EXPECTED_DELETE_PARAMS)
        expect(S3Instance.promise).toHaveBeenCalledTimes(1)
    });
});

describe('deleteBrand', () => {
    it('should delete brand image with given params', async () => {
        await repository.deleteBrand(MOCK_NAME)

        const EXPECTED_DELETE_PARAMS: PutObjectRequest = {
            Bucket: ENVIROMENT_VARIABLE.AWS_BUCKET,
            Key: `BRAND/${MOCK_NAME}`
        }
        expect(S3Instance.deleteObject).toHaveBeenCalledTimes(1)
        expect(S3Instance.deleteObject).toBeCalledWith(EXPECTED_DELETE_PARAMS)
        expect(S3Instance.promise).toHaveBeenCalledTimes(1)
    });
});