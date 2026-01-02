import { Analyze } from "../../analyze";

export abstract class AnalyzeRepositoryInterface {
    abstract createAnalyze(data: any): Promise<void>
    abstract getAnalyzeById(id: string): Promise<Analyze | null>
    abstract updateAnalyze(id: string, data: any): Promise<void>
    abstract deleteAnalyze(id: string): Promise<void>
}