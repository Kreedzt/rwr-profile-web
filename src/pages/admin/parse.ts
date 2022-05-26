// SPDX-License-Identifier: GPL-3.0-only
import { PersonListItem } from "./model";
import { QueryItem, QueryModeEnum, QueryTypeEnum } from "./type";

export const parseQueryItem = (
  item: PersonListItem,
  query: QueryItem
): boolean => {
  const targetValue = item[query.key];
  const compareValue = query.value;
  switch (query.type) {
    case QueryTypeEnum.LESS:
      return targetValue < compareValue;
    case QueryTypeEnum.GREATER:
      return targetValue > compareValue;
    case QueryTypeEnum.EQUAL: {
      return targetValue.toString() === compareValue;
    }
    case QueryTypeEnum.CONTAIN: {
      return targetValue.toString().includes(compareValue);
    }
  }
};

export const parseQueryList = (
  item: PersonListItem,
  queryList: QueryItem[],
  mode: QueryModeEnum
): boolean => {
  let res = false;

  switch (mode) {
    case "all":
      res = queryList.every((q) => {
        return parseQueryItem(item, q);
      });
      break;
    case "one":
      res = queryList.some((q) => {
        return parseQueryItem(item, q);
      });
      break;
  }

  return res;
};
