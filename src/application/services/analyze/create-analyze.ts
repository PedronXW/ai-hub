import { Injectable } from "@nestjs/common";
import { Analyze } from "src/domain/analyze";
import { AnalyzeRepositoryInterface } from "src/domain/repositories/persistence/analyze-repository-interface";

@Injectable()
export class CreateAnalyzeService {
    constructor(private readonly analyzeRepository: AnalyzeRepositoryInterface) {}

    async execute(name: string, prompt: string, modelId: string) {
        const analyze = Analyze.create({
            name: name,
            prompt: prompt,
            modelId: modelId,
        })

        await this.analyzeRepository.createAnalyze(analyze)
        
        return analyze
    }
}