import { randomUUID } from 'crypto';
import { Optional } from 'src/@shared/types/optional';

export type ModelProps = {
  id?: string;
  name: string;
  environment_variables: Array<string>;
  createdAt: Date;
  updatedAt: Date;
};

export class Model implements ModelProps {
  id?: string;
  name: string;
  environment_variables: Array<string>;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: ModelProps) {
    this.id = props.id || randomUUID();
    this.name = props.name;
    this.environment_variables = props.environment_variables;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getEnvironmentVariables() {
    return this.environment_variables;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getUpdatedAt() {
    return this.updatedAt;
  }

  static create(props: Optional<ModelProps, 'createdAt' | 'updatedAt'>) {
    return new Model({
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }
}
