import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class MongoService extends MongoClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super(process.env.MONGO_CONNECTION || 'mongodb://admin:admin@localhost:27017/ai_hub?authSource=admin');
  }

  getDb() {
    return this.db();
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }
}
