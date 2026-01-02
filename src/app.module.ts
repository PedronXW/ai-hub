import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateAnalyzeService } from './application/services/analyze/create-analyze';
import { CreateAttachmentService } from './application/services/attachment/create-attachment';
import { CreateModelService } from './application/services/model/create-model';
import { CreateProcessService } from './application/services/process/create-process';
import { ExampleController } from './controller';
import { AnalyzeRepositoryInterface } from './domain/repositories/persistence/analyze-repository-interface';
import { AttachmentRepository } from './domain/repositories/persistence/attachment-repository';
import { ModelRepositoryInterface } from './domain/repositories/persistence/model-repository-interface';
import { ProcessRepositoryInterface } from './domain/repositories/persistence/process-repository-interface';
import { CreateAnalyzeController } from './infra/controllers/http/analyze/create-analyze';
import { CreateAttachmentController } from './infra/controllers/http/attachment/create-attachment';
import { CreateModelController } from './infra/controllers/http/model/create-model';
import { CreateProcessController } from './infra/controllers/http/process/create-process';
import { MongoAnalyzeRepository } from './infra/repositories/mongo/analyze-repository';
import { MongoAttachmentRepository } from './infra/repositories/mongo/attachment-repository';
import { MongoModelRepository } from './infra/repositories/mongo/model-repository';
import { MongoProcessRepository } from './infra/repositories/mongo/process-repository';
import { S3_CLIENT, s3ClientFactory } from './infra/s3/s3.config';
import { S3Service } from './infra/s3/s3.service';
import { MongoModule } from './mongo/mongo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule
  ],
  controllers: [CreateAnalyzeController, CreateModelController, CreateProcessController, CreateAttachmentController, ExampleController],
  providers: [
    CreateAnalyzeService, 
    CreateModelService, 
    CreateProcessService, 
    CreateAttachmentService,
    S3Service,
    {
      provide: S3_CLIENT,
      useFactory: s3ClientFactory,
    },
    {provide: AnalyzeRepositoryInterface, useClass: MongoAnalyzeRepository}, 
    {provide: ModelRepositoryInterface, useClass: MongoModelRepository}, 
    {provide: ProcessRepositoryInterface, useClass: MongoProcessRepository},
    {provide: AttachmentRepository, useClass: MongoAttachmentRepository},
  ],
})
export class AppModule {}
