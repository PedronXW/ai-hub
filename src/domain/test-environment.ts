import { randomUUID } from 'crypto';
import { Optional } from 'src/@shared/types/optional';

export type TestEnvironmentProps = {
  id?: string;
  name: string;
  test_variables: Array<string>;
  inputs: Array<string>;
  outputs: Array<string>;
  createdAt: Date;
  updatedAt: Date;
};

export class TestEnvironment implements TestEnvironmentProps {
  id?: string;
  name: string;
  test_variables: Array<string>;
  inputs: Array<string>;
  outputs: Array<string>;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: TestEnvironmentProps) {
    this.id = props.id || randomUUID();
    this.name = props.name;
    this.test_variables = props.test_variables;
    this.inputs = props.inputs;
    this.outputs = props.outputs;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getTestVariables() {
    return this.test_variables;
  }

  public getInputs() {
    return this.inputs;
  }

  public getOutputs() {
    return this.outputs;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getUpdatedAt() {
    return this.updatedAt;
  }

  static create(
    props: Optional<
      TestEnvironmentProps,
      'createdAt' | 'updatedAt' | 'test_variables' | 'inputs' | 'outputs'
    >,
  ) {
    return new TestEnvironment({
      ...props,
      test_variables: props.test_variables || [],
      inputs: props.inputs || [],
      outputs: props.outputs || [],
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }
}
