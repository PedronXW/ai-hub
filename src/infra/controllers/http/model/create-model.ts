import { Body, Controller, Post } from "@nestjs/common";
import { CreateModelService } from "src/application/services/model/create-model";

@Controller('models')
export class CreateModelController {
    constructor(private readonly createModelService: CreateModelService) {}

    @Post()
    async handle(@Body() body: {name: string, environment_variables: Record<string, string>}): Promise<void> {
        await this.createModelService.execute(body.name, body.environment_variables)
    }
}