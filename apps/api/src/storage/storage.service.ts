import { Injectable } from '@nestjs/common'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class StorageService {
  private readonly s3: S3Client

  constructor() {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
      },
    })
  }

  async getPresignedUrl(fileName: string, contentType: string, folder: string) {
    const key = `${folder}/${Date.now()}-${fileName}`
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })
    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 })
    return {
      uploadUrl: url,
      publicUrl: `${process.env.R2_PUBLIC_URL}/${key}`,
      key,
    }
  }
}
