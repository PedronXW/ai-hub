import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { QueriesInterface } from "src/domain/repositories/queries/queries-interface";

type ClaudeBedrockResponse = {
  content: {
    type: 'text';
    text: string;
  }[];
};

type ClaudeHaikuData = {
  prompt: string;
  attachments: {type: string; name: string; buffer: Buffer}[];
};

export class ClaudeHaiku45Repository implements QueriesInterface{
    private readonly bedrockClient: BedrockRuntimeClient;
    
      constructor() {
        this.bedrockClient = new BedrockRuntimeClient({
          region: 'us-east-1',
        });
      }

      async query(data: unknown): Promise<string> {

        const claudeData = data as ClaudeHaikuData;

        const command = new InvokeModelCommand({
              modelId:
                'arn:aws:bedrock:us-east-1:333012028209:inference-profile/global.anthropic.claude-haiku-4-5-20251001-v1:0',
              contentType: 'application/json',
              accept: 'application/json',
              body: JSON.stringify({
                anthropic_version: 'bedrock-2023-05-31',
                messages: [
                  {
                    role: 'user',
                    content: claudeData.prompt,
                  },
                ],
                attachments: claudeData.attachments.map((attachment) => ({
                  type: attachment.type,
                  name: attachment.name,
                  data: attachment.buffer.toString('base64'),
                })),
                max_tokens: 10000,
              }),
            });
        
            const response = await this.bedrockClient.send(command);
        
            const decoded = new TextDecoder().decode(response.body);
        
            const result = JSON.parse(decoded) as ClaudeBedrockResponse;
        
            console.log('Response from Bedrock:', result);
        
            return result.content[0].text;
      }
}