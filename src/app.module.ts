import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateAnalyzeService } from './application/services/analyze/create-analyze';
import { CreateModelService } from './application/services/model/create-model';
import { CreateProcessService } from './application/services/process/create-process';
import { AnalyzeRepositoryInterface } from './domain/repositories/analyze-repository-interface';
import { AttachmentRepository } from './domain/repositories/attachment-repository';
import { ModelRepositoryInterface } from './domain/repositories/model-repository-interface';
import { ProcessRepositoryInterface } from './domain/repositories/process-repository-interface';
import { CreateAnalyzeController } from './infra/controllers/http/analyze/create-analyze';
import { CreateModelController } from './infra/controllers/http/model/create-model';
import { CreateProcessController } from './infra/controllers/http/process/create-process';
import { MongoAnalyzeRepository } from './infra/repositories/analyze-repository';
import { MongoAttachmentRepository } from './infra/repositories/attachment-repository';
import { MongoModelRepository } from './infra/repositories/model-repository';
import { MongoProcessRepository } from './infra/repositories/process-repository';
import { S3Service } from './infra/s3/s3.service';
import { MongoModule } from './mongo/mongo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule
  ],
  controllers: [CreateAnalyzeController, CreateModelController, CreateProcessController],
  providers: [
    CreateAnalyzeService, 
    CreateModelService, 
    CreateProcessService, 
    S3Service,
    {provide: AnalyzeRepositoryInterface, useClass: MongoAnalyzeRepository}, 
    {provide: ModelRepositoryInterface, useClass: MongoModelRepository}, 
    {provide: ProcessRepositoryInterface, useClass: MongoProcessRepository},
    {provide: AttachmentRepository, useClass: MongoAttachmentRepository},
  ],
})
export class AppModule {}
