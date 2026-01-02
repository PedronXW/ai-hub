import {
  BedrockRuntimeClient,
  ConverseCommand
} from '@aws-sdk/client-bedrock-runtime';
import { Controller, Get } from '@nestjs/common';
import { readFileSync } from 'fs';
import { PDFDocument } from "pdf-lib";

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


  async splitPdfByPages(
    inputPath: string,
    pagesPerChunk = 5
  ): Promise<Buffer[]> {
    const bytes = readFileSync(inputPath);
    const pdf = await PDFDocument.load(bytes);

    const totalPages = pdf.getPageCount();
    const chunks: Buffer[] = [];

    for (let i = 0; i < totalPages; i += pagesPerChunk) {
      const chunkPdf = await PDFDocument.create();
      const pageIndexes = Array.from(
        { length: Math.min(pagesPerChunk, totalPages - i) },
        (_, idx) => i + idx
      );

      const pages = await chunkPdf.copyPages(pdf, pageIndexes);
      pages.forEach((p) => chunkPdf.addPage(p));

      const chunkBytes = await chunkPdf.save();
      chunks.push(Buffer.from(chunkBytes));
    }

    return chunks;
  }


  @Get()
  async execute(): Promise<string> {
    const pdfChunks = await this.splitPdfByPages("document.pdf", 5);

    const results = [];

      for (let i = 0; i < pdfChunks.length; i++) {
        const command = new ConverseCommand({
          modelId: "arn:aws:bedrock:us-east-1:333012028209:inference-profile/global.anthropic.claude-haiku-4-5-20251001-v1:0",
          messages: [
            {
              role: "user",
              content: [
                {
                  document: {
                    name: `documentchunk${i + 1}`,
                    format:"pdf",
                    citations: {
                      enabled: true
                    },
                    source:{
                      bytes: pdfChunks[i]
                    }
                  }
                },
                {
                  text: `Analise este trecho do documento (chunk ${i + 1})`,
                },
              ],
            },
          ],
          inferenceConfig: {
            maxTokens: 2048,
          },
        });

        const response = await this.bedrockClient.send(command);
        console.log(`Chunk ${i + 1}`, JSON.stringify(response.output?.message?.content));
      }


    console.log(results);

    const claudeResponse = results as ClaudeBedrockResponse[];
    return claudeResponse.map(r => r.content.map((c) => c.text).join('\n')).join('\n');
  }
}
