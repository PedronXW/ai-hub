import { Injectable } from "@nestjs/common";
import { Db } from "mongodb";
import { ProcessRepositoryInterface } from "src/domain/repositories/process-repository-interface";
import { MongoService } from "src/mongo/mongo.service";

export type MongoProcess = {
  _id: string;
  name: string;
  analyzeId: string;
  attachments_ids: Array<string>;
  inputData: Array<object>;
  outputData: Array<object>;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MongoProcessRepository implements ProcessRepositoryInterface {
    private readonly mongo: Db;
    
    constructor(private readonly mongoClient: MongoService) {
        this.mongo = this.mongoClient.getDb();
    }

    async createProcess(data: any): Promise<void> {
        await this.mongo.collection<MongoProcess>('processes').insertOne({
            _id: data.id,
            name: data.name,
            analyzeId: data.analyzeId,
            attachments_ids: data.attachments_ids,
            inputData: data.inputData,
            outputData: data.outputData,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        })        
    }

    async getProcessById(id: string): Promise<any> {
        const processData = await this.mongo.collection<MongoProcess>('processes').findOne({ _id: id });
        return processData;
    }

    async updateProcess(id: string, data: any): Promise<void> {
        const updateData: Partial<MongoProcess> = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.analyzeId !== undefined) updateData.analyzeId = data.analyzeId;
        if (data.attachments_ids !== undefined) updateData.attachments_ids = data.attachments_ids;
        if (data.inputData !== undefined) updateData.inputData = data.inputData;
        if (data.outputData !== undefined) updateData.outputData = data.outputData;
        if (data.updatedAt !== undefined) updateData.updatedAt = data.updatedAt;

        await this.mongo.collection<MongoProcess>('processes').updateOne(
            { _id: id },
            { $set: updateData }
        );
    }

    async deleteProcess(id: string): Promise<void> {
        await this.mongo.collection<MongoProcess>('processes').deleteOne({ _id: id });
    }

}