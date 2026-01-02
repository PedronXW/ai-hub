import { Injectable } from "@nestjs/common";
import { Db } from "mongodb";
import { Analyze } from "src/domain/analyze";
import { AnalyzeRepositoryInterface } from "src/domain/repositories/persistence/analyze-repository-interface";
import { MongoService } from "src/mongo/mongo.service";


export type MongoAnalyze = {
    _id?: string;
    name: string;
    assertiveness?: number;
    modelId: string;
    test_environments_ids: Array<string>;
    prompt: string;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class MongoAnalyzeRepository  implements AnalyzeRepositoryInterface {
    private readonly mongo: Db;

    constructor(private mongoClient: MongoService) {
        this.mongo = this.mongoClient.getDb();
    }

    async createAnalyze(data: Analyze): Promise<void> {
        await this.mongo.collection<MongoAnalyze>('analysis').insertOne({
            _id: data.id,
            name: data.name,
            modelId: data.modelId,
            assertiveness: data.assertiveness,
            prompt: data.prompt,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            test_environments_ids: data.test_environments_ids,
        })        
    }

    async getAnalyzeById(id: string): Promise<Analyze | null> {
        const analyzeData = await this.mongo.collection<MongoAnalyze>('analyzes').findOne({ _id: id });
        if (!analyzeData) {
            return null;
        }
        
        return new Analyze({
            id: analyzeData._id,
            name: analyzeData.name,
            modelId: analyzeData.modelId,
            assertiveness: analyzeData.assertiveness,
            prompt: analyzeData.prompt,
            createdAt: analyzeData.createdAt,
            updatedAt: analyzeData.updatedAt,
            test_environments_ids: analyzeData.test_environments_ids,
        });
    }

    async updateAnalyze(id: string, data: Partial<Analyze>): Promise<void> {
        const updateData: Partial<MongoAnalyze> = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.modelId !== undefined) updateData.modelId = data.modelId;
        if (data.assertiveness !== undefined) updateData.assertiveness = data.assertiveness;
        if (data.prompt !== undefined) updateData.prompt = data.prompt;
        if (data.createdAt !== undefined) updateData.createdAt = data.createdAt;
        if (data.updatedAt !== undefined) updateData.updatedAt = data.updatedAt;
        if (data.test_environments_ids !== undefined) {
            updateData.test_environments_ids = data.test_environments_ids;
        }

        await this.mongo.collection<MongoAnalyze>('analyzes').updateOne(
            { _id: id },
            { $set: updateData }
        );
    }

    async deleteAnalyze(id: string): Promise<void> {
        await this.mongo.collection<MongoAnalyze>('analyzes').deleteOne({ _id: id });
    }
}