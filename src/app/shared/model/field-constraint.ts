export class FieldConstraint {
  value: string | string[];
  matchMode: string;

  constructor(value: string | string[], matchMode: string) {
    this.value = value;
    this.matchMode = matchMode;
  }
}
