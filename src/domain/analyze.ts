import { randomUUID } from 'crypto';
import { Optional } from 'src/@shared/types/optional';
import { Model } from './model';
import { TestEnvironment } from './test-environment';

export type AnalyzeProps = {
  id?: string;
  name: string;
  model: Model;
  assertiveness?: number;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
  test_environment: Array<TestEnvironment>;
};

export class Analyze implements AnalyzeProps {
  id?: string;
  name: string;
  model: Model;
  assertiveness?: number;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
  test_environment: Array<TestEnvironment>;

  constructor(props: AnalyzeProps) {
    this.id = props.id || randomUUID();
    this.name = props.name;
    this.model = props.model;
    this.assertiveness = props.assertiveness || undefined;
    this.prompt = props.prompt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.test_environment = props.test_environment;
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getModel() {
    return this.model;
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

  public getTestEnvironment() {
    return this.test_environment;
  }

  static create(
    props: Optional<
      AnalyzeProps,
      'createdAt' | 'updatedAt' | 'test_environment' | 'assertiveness'
    >,
  ) {
    return new Analyze({
      ...props,
      assertiveness: props.assertiveness || undefined,
      test_environment: props.test_environment || [],
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }
}
