import { Body, Controller, Post } from "@nestjs/common";
import { CreateAnalyzeService } from "src/application/services/analyze/create-analyze";

@Controller('analyzes')
export class CreateAnalyzeController {
    constructor(private readonly createAnalyzeService: CreateAnalyzeService) {}

    @Post()
    async handle(@Body() body: {name: string, prompt: string, modelId: string}) {
        return await this.createAnalyzeService.execute(body.name, body.prompt, body.modelId)
    }
}