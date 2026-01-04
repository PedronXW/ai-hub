import {
  BedrockRuntimeClient,
  ConverseCommand
} from '@aws-sdk/client-bedrock-runtime';
import { Controller, Get, Post } from '@nestjs/common';
import { createCanvas, Image } from 'canvas';
import { readFileSync } from 'fs';
import { pdf } from "pdf-to-img";

(global as any).Canvas = createCanvas;
(global as any).Image = Image;

@Controller('example')
export class ExampleController {
  private readonly bedrockClient: BedrockRuntimeClient;

  constructor() {
    this.bedrockClient = new BedrockRuntimeClient({
      region: 'us-east-1',
    });
  }

  async converterPdfParaImagens(pdfPath: string): Promise<Buffer[]> {
    const document = await pdf(pdfPath, { scale: 8 });
    const result: Buffer[] = [];
    for await (const image of document) {
      result.push(image);
    }
    return result;
  }

  @Get()
async execute() {
  const images = await this.converterPdfParaImagens('document.pdf');
  const results: any[] = [];

  for (let i = 0; i < images.length; i++) {
    const analises = [
      "Please provide a detailed description of the image contents.",
      "Extract all visible text from this page in a structured format.",
      "Identify if there are any signatures or stamps in this document."
    ];

    for (const prompt of analises) {
  const command = new ConverseCommand({
    modelId: 'arn:aws:bedrock:us-east-1:333012028209:inference-profile/us.anthropic.claude-haiku-4-5-20251001-v1:0',
    messages: [
      {
        role: 'user',
        content: [
          // 2. A IMAGEM (Agora ela faz parte do bloco estático)
          {
            image: {
              format: 'png',
              source: { bytes: images[i] },
            },
          },
          // 3. O MARCADOR (Deve vir APÓS a imagem para salvá-la no cache)
          {
                cachePoint: {
                    type: "default"
                }
            },
          // 4. O PROMPT (A única coisa que varia)
          { text: prompt }
        ],
      },
    ],
    inferenceConfig: { maxTokens: 2048, temperature: 0 },
  });

  const response = await this.bedrockClient.send(command);
      const usage = response.usage as any;

      console.log(`Página ${i + 1} | Tokens: ${usage.inputTokens}`);
      // Nomes de campos retornados pela SDK
      console.log(`- Gravado: ${usage.cacheWriteInputTokens ?? 0}`);
      console.log(`- Lido: ${usage.cacheReadInputTokens ?? 0}`);
      
      results.push({ page: i + 1, analysis: response.output?.message?.content?.[0]?.text });
    }
  }
  return results;
}

@Post()
async postExample() {
  const images = readFileSync('image.jpg')
  const results: any[] = [];

  const responseSchema = {
  tools: [
    {
      toolSpec: {
        name: "formatar_classificacao",
        description: "Envia os dados da classificação da imagem de forma estruturada.",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              tipo: { 
                type: "string", 
                enum: ["visual", "documental"],
                description: "Classificação entre foto/objeto ou documento/recibo."
              },
              temVeiculo: { 
                type: "boolean",
                description: "Indica se há um veículo na imagem."
              },
              faceVeiculo: { 
                type: "string", 
                enum: ["frontal", "traseira", "lateral", "nao se aplica"],
                description: "A face visível do veículo."
              }
            },
            required: ["tipo", "temVeiculo", "faceVeiculo"]
          }
        }
      }
    }
  ],
  toolChoice: { tool: { name: "formatar_classificacao" } } // Força o modelo a usar esta ferramenta
};

  const command = new ConverseCommand({
    modelId: 'arn:aws:bedrock:us-east-1:333012028209:inference-profile/us.anthropic.claude-haiku-4-5-20251001-v1:0',
    messages: [
      {
        role: 'user',
        content: [
          // 2. A IMAGEM (Agora ela faz parte do bloco estático)
          {
            image: {
              format: 'png',
              source: { bytes: images },
            },
          },
          // 3. O MARCADOR (Deve vir APÓS a imagem para salvá-la no cache)
          {
                cachePoint: {
                    type: "default"
                }
            },
          // 4. O PROMPT (A única coisa que varia)
          { text: `
            Você é um classificador de imagens.

            Faça as seguintes classificações:

            1.
            Classifique essa imagem como visual ou documental. Visual são fotos de pessoas, paisagens, objetos. Documental são documentos, recibos, contratos, etc.
            
            2.
            Existe algum veículo nessa imagem?

            3.
            Se tiver veículo, quais as faces do veículo estão visíveis, considere somente o veículo principal (frontal, traseira, lateral)?

            Responda no seguinte formato JSON:

            {
              "tipo": "visual" | "documental",
              "temVeiculo": true | false,
              "faceVeiculo": "frontal" | "traseira" | "lateral" | "nao se aplica"
            }

            `}
        ],
      },
    ],
    toolConfig: responseSchema,
    inferenceConfig: { maxTokens: 2048, temperature: 0 },
  });

  const response = await this.bedrockClient.send(command);
      const usage = response.usage as any;
      console.log(`Tokens: ${usage.inputTokens}`);
      // Nomes de campos retornados pela SDK
      console.log(`- Gravado: ${usage.cacheWriteInputTokens ?? 0}`);
      console.log(`- Lido: ${usage.cacheReadInputTokens ?? 0}`);
      results.push({ page: 1, analysis: JSON.stringify(response.output?.message?.content?.[0]?.toolUse?.input) });
    

  console.log(results);
  
  return results;
}
}