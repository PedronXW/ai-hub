import { randomUUID } from 'crypto';

type AttachmentProperties = {
  id?: string;
  name: string;
  type: string;
  link: string;
  createdAt?: Date;
};

export class Attachment implements AttachmentProperties {
  id?: string;
  name: string;
  type: string;
  link: string;
  createdAt?: Date;

  private constructor({ id, name, type, link, createdAt }: AttachmentProperties) {
    this.id = id ?? randomUUID();
    this.name = name;
    this.type = type;
    this.link = link;
    this.createdAt = createdAt ?? new Date();
  }

  static create({ id, name, type, link, createdAt }: AttachmentProperties) {
    return new Attachment({ id, name, type, link, createdAt });
  }
}
