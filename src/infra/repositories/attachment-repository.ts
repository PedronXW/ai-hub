import { Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { Attachment } from 'src/domain/attachment';
import { AttachmentRepository } from 'src/domain/repositories/attachment-repository';
import { MongoService } from 'src/mongo/mongo.service';
import { Readable } from 'stream';
import { S3Service } from '../s3/s3.service';

export type MongoAttachment = {
  id: string;
  name: string;
  link: string;
  type: string;
  createdAt: Date;
};

@Injectable()
export class MongoAttachmentRepository implements AttachmentRepository {
  private readonly mongo: Db;

  constructor(
    private readonly mongoClient: MongoService,
    private readonly s3Service: S3Service,
  ) {
    this.mongo = this.mongoClient.getDb();
  }

  async persist(attachment: Attachment): Promise<Attachment> {
    const collection = this.mongo.collection('attachments');
    const mongoAttachment: MongoAttachment = {
      id: attachment.id!,
      name: attachment.name,
      link: attachment.link,
      type: attachment.type,
      createdAt: attachment.createdAt!,
    };
    await collection.insertOne(mongoAttachment);
    return attachment;
  }

  async findById(id: string): Promise<Attachment | null> {
    const collection = this.mongo.collection<MongoAttachment>('attachments');
    const mongoAttachment = await collection.findOne({ id });
    if (!mongoAttachment) {
      return null;
    }
    return Attachment.create({
      id: mongoAttachment.id,
      name: mongoAttachment.name,
      link: mongoAttachment.link,
      type: mongoAttachment.type,
      createdAt: mongoAttachment.createdAt,
    });
  }

  async hasPendingAttachments(incidentId: string): Promise<boolean> {
    const collection = this.mongo.collection('analyzes');
    const count = await collection.countDocuments({
      incidentId: incidentId,
      processed: { $ne: true },
    });
    return count > 0;
  }

  async markAsProcessed(id: string): Promise<void> {
    const collection = this.mongo.collection('attachments');
    await collection.updateOne({ id }, { $set: { processed: true } });
  }

  async putFileContent(id: string, content: Readable, type: string): Promise<void> {
    await this.s3Service.uploadFile(`attachments/${id}`, content, type);
  }

  async getFileContent(id: string): Promise<Readable | undefined> {
    return this.s3Service.getFileStream(`attachments/${id}`);
  }

  async getFileLink(id: string): Promise<string | undefined> {
    return this.s3Service.getUrl(`attachments/${id}`);
  }
}
