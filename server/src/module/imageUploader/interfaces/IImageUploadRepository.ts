import { AWSError, S3 } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";

export interface IImageUploadRepository {
    uploadProduct: (imageBuffer: Buffer, extension: string) => Promise<S3.ManagedUpload.SendData>
    uploadBrand: (imageBuffer: Buffer, extension: string) => Promise<S3.ManagedUpload.SendData>
    deleteProduct: (imageName: string) => Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>>
    deleteBrand: (imageName: string) => Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>>
}