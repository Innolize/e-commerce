import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { AWSError, S3 } from 'aws-sdk'
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { v4 as uuidV4 } from 'uuid'
import { PromiseResult } from "aws-sdk/lib/request";
import {obtainExtension,obtainFilename} from '../utils/utils'

@injectable()
export class ImageUploadService extends AbstractService {
    private imageStorage: S3
    private PRODUCT_FOLDER = "PRODUCT"
    private BRAND_FOLDER = "BRAND"
    constructor(
        @inject(TYPES.Common.ImageStorage) imageStorage: S3
    ) {
        super()
        this.imageStorage = imageStorage
    }

    async uploadProduct(imageBuffer: Buffer, originalName: string): Promise<S3.ManagedUpload.SendData> {
        const imageExt = obtainExtension(originalName)
        const params: PutObjectRequest = {
            Bucket: <string>process.env.AWS_BUCKET,
            Key: `${this.PRODUCT_FOLDER}/${uuidV4()}.${imageExt}`,
            Body: imageBuffer

        }
        return this.imageStorage.upload(params).promise()
    }

    async uploadBrand(imageBuffer: Buffer, originalName: string): Promise<S3.ManagedUpload.SendData> {
        const imageExt = obtainExtension(originalName)
        const params: PutObjectRequest = {
            Bucket: <string>process.env.AWS_BUCKET,
            Key: `${this.BRAND_FOLDER}/${uuidV4()}.${imageExt}`,
            Body: imageBuffer

        }
        return await this.imageStorage.upload(params).promise()
    }
    async deleteProduct(imageUrl: string): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
        const ImageName = obtainFilename(imageUrl)
        return await this.imageStorage.deleteObject({
            Bucket: <string>process.env.AWS_BUCKET,
            Key: `${this.PRODUCT_FOLDER}/${ImageName}`,
        }).promise()
    }

    async deleteBrand(imageUrl: string): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
        const imageName = obtainFilename(imageUrl)
        console.log(Image)
        return await this.imageStorage.deleteObject({
            Bucket: <string>process.env.AWS_BUCKET,
            Key: `${this.BRAND_FOLDER}/${imageName}`,

        }).promise()
    }

}