export enum QueryTypeEnum {
  ASC = "asc",
  DESC = "desc",
}

export interface QueryItem {
  id: string;
  value: string;
  label: string;
  key: string;
  type: QueryTypeEnum;
}
