import { Readable } from 'stream';
import { Attachment } from '../attachment';

export abstract class AttachmentRepository {
  abstract persist(attachment: Attachment, buffer: Buffer): Promise<Attachment>;
  abstract findById(id: string): Promise<Attachment | null>;
  abstract hasPendingAttachments(incidentId: string): Promise<boolean>;
  abstract putFileContent(id: string, content: Readable, type: string): Promise<void>;
  abstract getFileContent(id: string): Promise<Readable | undefined>;
  abstract getFileLink(id: string): Promise<string | undefined>;
  abstract markAsProcessed(id: string): Promise<void>;
}
