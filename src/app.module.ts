import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExampleController } from './controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ExampleController],
  providers: [],
})
export class AppModule {}
