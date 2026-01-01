import { Injectable } from "@nestjs/common";
import { Model } from "src/domain/model";
import { ModelRepositoryInterface } from "src/domain/repositories/model-repository-interface";

@Injectable()
export class CreateModelService {
    constructor(private readonly modelRepository: ModelRepositoryInterface) {}

    async execute(name: string, environment_variables: Record<string, string>) {
        const model = Model.create({
            name: name,
            environment_variables: environment_variables
        })

        await this.modelRepository.createModel(model)
        
        return model
    }
}