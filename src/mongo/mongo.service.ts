import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Db, MongoClient } from "mongodb";

@Injectable()
export class MongoService
  implements OnModuleInit, OnModuleDestroy {

  private client: MongoClient;
  private database: Db;

  async onModuleInit() {
    console.log('Conectando ao MongoDB...');
    this.client = new MongoClient(
      process.env.MONGO_CONNECTION ||
      'mongodb://admin:admin@localhost:27017/ai_hub?authSource=admin',
    );

    await this.client.connect();
    this.database = this.client.db();

    console.log('Mongo conectado');
  }

  getDb(): Db {
    return this.database;
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}