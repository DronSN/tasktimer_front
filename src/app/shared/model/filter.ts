import { FieldConstraint } from './field-constraint';

export class Filter {
  fieldName: string;
  constraint: FieldConstraint;

  constructor(fieldName: string, constraint: FieldConstraint) {
    this.fieldName = fieldName;
    this.constraint = constraint;
  }
}
