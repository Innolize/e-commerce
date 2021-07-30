import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { AWSError, S3 } from 'aws-sdk'
import { PromiseResult } from "aws-sdk/lib/request";
import { obtainExtension, obtainFilename } from '../utils/utils'
import { ImageUploadRepository } from "../repository/imageUploadRepository";

@injectable()
export class ImageUploadService extends AbstractService {
    constructor(
        @inject(TYPES.ImageUploader.Repository) private imageUploaderRepository: ImageUploadRepository
    ) {
        super()
    }

    async uploadProduct(imageBuffer: Buffer, originalName: string): Promise<S3.ManagedUpload.SendData> {
        const imageExt = obtainExtension(originalName) as string
        return this.imageUploaderRepository.uploadProduct(imageBuffer, imageExt)
    }

    async uploadBrand(imageBuffer: Buffer, originalName: string): Promise<S3.ManagedUpload.SendData> {
        const imageExt = obtainExtension(originalName) as string
        return this.imageUploaderRepository.uploadBrand(imageBuffer, imageExt)
    }
    async deleteProduct(imageUrl: string): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
        const imageName = obtainFilename(imageUrl) as string
        return this.imageUploaderRepository.deleteProduct(imageName)
    }

    async deleteBrand(imageUrl: string): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
        const imageName = obtainFilename(imageUrl) as string
        return this.imageUploaderRepository.deleteBrand(imageName)
    }
}