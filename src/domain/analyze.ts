import { randomUUID } from 'crypto';
import { Optional } from 'src/@shared/types/optional';

export type AnalyzeProps = {
  id?: string;
  name: string;
  modelId: string;
  assertiveness?: number;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
  test_environments_ids: Array<string>;
};

export class Analyze implements AnalyzeProps {
  id?: string;
  name: string;
  modelId: string;
  assertiveness?: number;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
  test_environments_ids: Array<string>;

  constructor(props: AnalyzeProps) {
    this.id = props.id || randomUUID();
    this.name = props.name;
    this.modelId = props.modelId;
    this.assertiveness = props.assertiveness || undefined;
    this.prompt = props.prompt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.test_environments_ids = props.test_environments_ids;
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getModelId() {
    return this.modelId;
  }

  public getAssertiveness() {
    return this.assertiveness;
  }

  public getPrompt() {
    return this.prompt;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getUpdatedAt() {
    return this.updatedAt;
  }

  public getTestEnvironmentsIds() {
    return this.test_environments_ids;
  }

  static create(
    props: Optional<
      AnalyzeProps,
      'createdAt' | 'updatedAt' | 'test_environments_ids' | 'assertiveness'
    >,
  ) {
    return new Analyze({
      ...props,
      assertiveness: props.assertiveness || undefined,
      test_environments_ids: props.test_environments_ids || [],
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }
}
