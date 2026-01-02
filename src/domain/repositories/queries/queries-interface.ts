export abstract class QueriesInterface {
    abstract query(data: unknown): Promise<string>;
}