import { AWSError, S3 } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";

export interface IImageUploadService {
    uploadProduct: (imageBuffer: Buffer, originalName: string) => Promise<S3.ManagedUpload.SendData>
    uploadBrand: (imageBuffer: Buffer, originalName: string) => Promise<S3.ManagedUpload.SendData>
    deleteProduct: (imageUrl: string) => Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>>
    deleteBrand: (imageUrl: string) => Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>>
}