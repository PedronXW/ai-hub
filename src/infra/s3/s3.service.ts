import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { S3_CLIENT } from './s3.config';

@Injectable()
export class S3Service {
  private readonly bucket: string;

  constructor(
    @Inject(S3_CLIENT)
    private readonly s3Client: S3Client,
  ) {
    this.bucket = process.env.AWS_S3_BUCKET!;
  }

  async uploadFile(
    key: string,
    fileStream: Readable,
    contentType: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucket,
          Key: key,
          Body: fileStream,
          ContentType: contentType,
          Metadata: metadata
            ? Object.fromEntries(Object.entries(metadata).map(([k, v]) => [k, String(v).replace(/[^\x20-\x7E]/g, '')]))
            : undefined,
        },
      });

      await upload.done();
    } catch (error) {
      console.error('Error uploading file to S3:', error);
    }
  }

  async getFileStream(key: string): Promise<Readable | undefined> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      return response.Body as Readable;
    } catch (error) {
      console.error('Error retrieving file from S3:', error);
    }
  }

  async getUrl(path: string, expiresIn: number = 518400): Promise<string | undefined> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: path,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      console.error('Error generating signed URL for S3:', error);
    }
  }
}
