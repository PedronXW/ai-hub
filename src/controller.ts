import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { Controller, Get } from '@nestjs/common';

type ClaudeBedrockResponse = {
  content: {
    type: 'text';
    text: string;
  }[];
};

@Controller('example')
export class ExampleController {
  private readonly bedrockClient: BedrockRuntimeClient;

  constructor() {
    this.bedrockClient = new BedrockRuntimeClient({
      region: 'us-east-1',
    });
  }

  @Get()
  async execute(): Promise<string> {
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
            content: 'Explique o Amazon Bedrock em uma frase',
          },
        ],
        max_tokens: 100,
      }),
    });

    const response = await this.bedrockClient.send(command);

    const decoded = new TextDecoder().decode(response.body);

    const result = JSON.parse(decoded) as ClaudeBedrockResponse;

    console.log('Response from Bedrock:', result);

    return result.content[0].text;
  }
}
