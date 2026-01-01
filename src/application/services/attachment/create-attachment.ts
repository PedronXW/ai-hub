import { Attachment } from "src/domain/attachment";
import { AttachmentRepository } from "src/domain/repositories/attachment-repository";


export class CreateAttachmentService {
  constructor(
    private readonly attachmentRepository: AttachmentRepository,
  ) {}

  async execute(link: string, type: string, name: string) {
    const attachment = Attachment.create({
      link,
      type,
      name,
    });

    await this.attachmentRepository.persist(attachment);

    return attachment;
  }
}
