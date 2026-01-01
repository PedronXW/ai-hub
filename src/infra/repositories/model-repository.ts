import { Injectable } from "@nestjs/common";
import { Db } from "mongodb";
import { Model } from "src/domain/model";
import { ModelRepositoryInterface } from "src/domain/repositories/model-repository-interface";
import { MongoService } from "src/mongo/mongo.service";

export type MongoModel = {
    _id?: string;
    name: string;
    environment_variables: Record<string, string>;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class MongoModelRepository implements ModelRepositoryInterface {
    private readonly mongo: Db;

    constructor(private readonly mongoClient: MongoService) {
        this.mongo = this.mongoClient.getDb();
    }

    async createModel(data: any): Promise<void> {
        await this.mongo.collection<MongoModel>('models').insertOne({
            _id: data.id,
            name: data.name,
            environment_variables: data.environment_variables,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        })        
    }

    async getModelById(id: string): Promise<Model | null> {
        const modelData = await this.mongo.collection<MongoModel>('models').findOne({ _id: id });
        if (!modelData) {
            return null;
        }
        return new Model({
            id: modelData._id,
            name: modelData.name,
            environment_variables: modelData.environment_variables,
            createdAt: modelData.createdAt,
            updatedAt: modelData.updatedAt,
        });
    }

    async updateModel(id: string, data: Partial<Model>): Promise<void> {
        const updateData: Partial<MongoModel> = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.environment_variables !== undefined) updateData.environment_variables = data.environment_variables;
        if (data.updatedAt !== undefined) updateData.updatedAt = data.updatedAt;

        await this.mongo.collection<MongoModel>('models').updateOne(
            { _id: id },
            { $set: updateData }
        );
    }

    async deleteModel(id: string): Promise<void> {
        await this.mongo.collection<MongoModel>('models').deleteOne({ _id: id });
    }
}