import { AWSError, S3 } from "aws-sdk";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { v4 as uuidV4 } from 'uuid'
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { PromiseResult } from "aws-sdk/lib/request";
import { IImageUploadRepository } from "../interfaces/IImageUploadRepository";

@injectable()
export class ImageUploadRepository extends AbstractRepository implements IImageUploadRepository {
    private PRODUCT_FOLDER = "PRODUCT"
    private BRAND_FOLDER = "BRAND"
    constructor(
        @inject(TYPES.Common.ImageStorage) private readonly imagedb: S3
    ) {
        super()
    }

    async uploadProduct(imageBuffer: Buffer, extension: string): Promise<S3.ManagedUpload.SendData> {
        const params: PutObjectRequest = {
            Bucket: <string>process.env.AWS_BUCKET,
            Key: `${this.PRODUCT_FOLDER}/${uuidV4()}.${extension}`,
            Body: imageBuffer

        }
        return await this.imagedb.upload(params).promise()
    }

    async uploadBrand(imageBuffer: Buffer, extension: string): Promise<S3.ManagedUpload.SendData> {
        const params: PutObjectRequest = {
            Bucket: <string>process.env.AWS_BUCKET,
            Key: `${this.BRAND_FOLDER}/${uuidV4()}.${extension}`,
            Body: imageBuffer

        }
        return await this.imagedb.upload(params).promise()
    }
    async deleteProduct(imageName: string): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
        return await this.imagedb.deleteObject({
            Bucket: <string>process.env.AWS_BUCKET,
            Key: `${this.PRODUCT_FOLDER}/${imageName}`,
        }).promise()
    }

    async deleteBrand(imageName: string): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
        return await this.imagedb.deleteObject({
            Bucket: <string>process.env.AWS_BUCKET,
            Key: `${this.BRAND_FOLDER}/${imageName}`,

        }).promise()
    }
}