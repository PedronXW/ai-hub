import { randomUUID } from 'crypto';
import { Optional } from 'src/@shared/types/optional';

export type ProcessProps = {
  id?: string;
  name: string;
  analyzeId: string;
  attachments: Array<string>;
  inputData: Array<string>;
  outputData: Array<string>;
  createdAt: Date;
  updatedAt: Date;
};

export class Process implements ProcessProps {
  id?: string;
  name: string;
  analyzeId: string;
  attachments: Array<string>;
  inputData: Array<string>;
  outputData: Array<string>;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: ProcessProps) {
    this.id = props.id || randomUUID();
    this.name = props.name;
    this.analyzeId = props.analyzeId;
    this.attachments = props.attachments;
    this.inputData = props.inputData;
    this.outputData = props.outputData;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getAnalyzeId() {
    return this.analyzeId;
  }

  public getAttachments() {
    return this.attachments;
  }

  public getInputData() {
    return this.inputData;
  }

  public getOutputData() {
    return this.outputData;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getUpdatedAt() {
    return this.updatedAt;
  }

  static create(
    props: Optional<
      ProcessProps,
      'createdAt' | 'updatedAt' | 'attachments' | 'inputData' | 'outputData'
    >,
  ) {
    return new Process({
      ...props,
      attachments: props.attachments || [],
      inputData: props.inputData || [],
      outputData: props.outputData || [],
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }
}
