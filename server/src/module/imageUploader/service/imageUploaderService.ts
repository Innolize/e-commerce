import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { AWSError, S3 } from 'aws-sdk'
import { PromiseResult } from "aws-sdk/lib/request";
import { obtainExtension, obtainFilename } from '../utils/utils'
import { IImageUploadService } from "../interfaces/IImageUploadService";
import { IImageUploadRepository } from "../interfaces/IImageUploadRepository";

@injectable()
export class ImageUploadService extends AbstractService implements IImageUploadService {
    constructor(
        @inject(TYPES.ImageUploader.Repository) private imageUploaderRepository: IImageUploadRepository
    ) {
        super()
    }

    async uploadProduct(imagefile: Express.Multer.File): Promise<S3.ManagedUpload.SendData> {
        const { buffer, originalname } = imagefile
        const imageExt = obtainExtension(originalname) as string
        return this.imageUploaderRepository.uploadProduct(buffer, imageExt)
    }

    async uploadBrand(imagefile: Express.Multer.File): Promise<S3.ManagedUpload.SendData> {
        const { buffer, originalname } = imagefile
        const imageExt = obtainExtension(originalname)
        return this.imageUploaderRepository.uploadBrand(buffer, imageExt)
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