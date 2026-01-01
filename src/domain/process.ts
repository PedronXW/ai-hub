import { randomUUID } from 'crypto';
import { Optional } from 'src/@shared/types/optional';

export type Data = {name: string; value: string};

export type ProcessProps = {
  id?: string;
  name: string;
  analyzeId: string;
  attachments_ids: Array<string>;
  inputData: Array<Data>;
  outputData: Array<Data>;
  createdAt: Date;
  updatedAt: Date;
};

export class Process implements ProcessProps {
  id?: string;
  name: string;
  analyzeId: string;
  attachments_ids: Array<string>;
  inputData: Array<Data>;
  outputData: Array<Data>;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: ProcessProps) {
    this.id = props.id || randomUUID();
    this.name = props.name;
    this.analyzeId = props.analyzeId;
    this.attachments_ids = props.attachments_ids;
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

  public getAttachmentsIds() {
    return this.attachments_ids;
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
      'createdAt' | 'updatedAt' | 'attachments_ids' | 'inputData' | 'outputData'
    >,
  ) {
    return new Process({
      ...props,
      attachments_ids: props.attachments_ids || [],
      inputData: props.inputData || [],
      outputData: props.outputData || [],
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }
}
