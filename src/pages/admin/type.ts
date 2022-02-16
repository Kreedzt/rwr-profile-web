export enum QueryTypeEnum {
  GREATER = "gt",
  LESS = "lt",
  EQUAL = "eq",
  CONTAIN = "in",
}

export interface QueryItem {
  id: string;
  value: string;
  label: string;
  key: string;
  type: QueryTypeEnum;
}
