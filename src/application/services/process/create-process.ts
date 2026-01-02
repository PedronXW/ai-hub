import { Injectable } from "@nestjs/common";
import { Process } from "src/domain/process";
import { ProcessRepositoryInterface } from "src/domain/repositories/persistence/process-repository-interface";

@Injectable()
export class CreateProcessService {
    constructor(private readonly processRepository: ProcessRepositoryInterface) {}

    async execute(name: string, analyzeId: string, inputData: {name: string, value: string}[], attachments_ids: string[]): Promise<Process> {
        const process = Process.create({
            name: name,
            analyzeId,
            inputData,
            attachments_ids,
        })

        await this.processRepository.createProcess(process)
        
        return process
    }
}