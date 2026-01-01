import { Body, Controller, Post } from "@nestjs/common";
import { CreateProcessService } from "src/application/services/process/create-process";

@Controller('processes')
export class CreateProcessController {
    constructor(private readonly createProcessService: CreateProcessService) {}

    @Post()
    async handle(@Body() body: {name: string, analyzeId: string, inputData: {name: string, value: string}[], attachments_ids: string[]}): Promise<void> {
        await this.createProcessService.execute(body.name, body.analyzeId, body.inputData, body.attachments_ids)
    }
}