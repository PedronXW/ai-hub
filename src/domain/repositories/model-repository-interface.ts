import { Model } from "../model";

export abstract class ModelRepositoryInterface {
    abstract createModel(data: any): Promise<void>
    abstract getModelById(id: string): Promise<Model | null>
    abstract updateModel(id: string, data: any): Promise<void>
    abstract deleteModel(id: string): Promise<void>
}