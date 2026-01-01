import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateAttachmentService } from "src/application/services/attachment/create-attachment";

@Controller('attachments')
export class CreateAttachmentController {
  constructor(
    private readonly createAttachmentService: CreateAttachmentService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    return this.createAttachmentService.execute(file.buffer, file.mimetype, file.originalname);
  }
}