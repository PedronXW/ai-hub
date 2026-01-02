import { Process } from "../../process";

export abstract class ProcessRepositoryInterface {
    abstract createProcess(data: any): Promise<void>
    abstract getProcessById(id: string): Promise<Process | null>
    abstract updateProcess(id: string, data: any): Promise<void>
    abstract deleteProcess(id: string): Promise<void>
}