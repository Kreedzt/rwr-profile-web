// SPDX-License-Identifier: GPL-3.0-only
import { PersonListItem } from "./model";

export enum QueryTypeEnum {
  GREATER = "gt",
  LESS = "lt",
  EQUAL = "eq",
  CONTAIN = "in",
}

export interface QueryItem {
  id: string;
  value: any;
  label: string;
  key: keyof PersonListItem;
  type: QueryTypeEnum;
}

export enum QueryModeEnum {
  ALL = 'all',
  ONE = 'one'
}
