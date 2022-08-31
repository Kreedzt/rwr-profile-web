// SPDX-License-Identifier: GPL-3.0-only
import { useCallback, useRef, useState } from "react";
import { PersonListItem } from "./model";
import { Person } from "../../models/person";
import { Profile } from "../../models/profile";
import { PersonService } from "../../services/person";
import { PERSON_LIST_COLUMNS } from "./columns";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { StorageService } from "../../services/storage";
import { StorageQueryItem } from "../../models/query";
import dayjs from "dayjs";

export const useQueryList = () => {
  const [queryLoading, setQueryLoading] = useState(false);
  const [dataList, setDataList] = useState<PersonListItem[]>([]);

  const [displayList, setDisplayList] = useState<PersonListItem[]>([]);

  /**
     映射关系: [sid, [profile_id]]
     */
  const sidMapRef = useRef<Map<string, number[]>>(new Map());
  const allProfileIdMapRef = useRef<Map<number, PersonListItem>>(new Map());
  const rawDataMapRef = useRef<Map<number, [Person, Profile]>>(new Map());

  const refreshDataList = useCallback(
    (dataList: Array<[number, Person, Profile]>) => {
      sidMapRef.current.clear();
      allProfileIdMapRef.current.clear();
      rawDataMapRef.current.clear();

      dataList.forEach((info) => {
        const resInfo: PersonListItem = {
          profile_id: info[0],
          username: info[2].username,
          xp: info[1].authority,
          rp: info[1].job_points,
          squad_tag: info[2].squad_tag,
          sid: info[2].sid,
          time_played: info[2].stats.time_played,
          kills: info[2].stats.kills,
          deaths: info[2].stats.deaths,
          player_kills: info[2].stats.player_kills,
          soldier_group: info[1].soldier_group_name,
          associated_count: 1,
        };

        const sidMapValue = sidMapRef.current.get(resInfo.sid);

        if (sidMapValue === undefined) {
          sidMapRef.current.set(resInfo.sid, [resInfo.profile_id]);
        } else {
          sidMapRef.current.set(resInfo.sid, [
            ...sidMapValue,
            resInfo.profile_id,
          ]);
        }

        allProfileIdMapRef.current.set(resInfo.profile_id, resInfo);
        rawDataMapRef.current.set(info[0], [info[1], info[2]]);
      });

      allProfileIdMapRef.current.forEach((info) => {
        const sidMapValue = sidMapRef.current.get(info.sid);

        info.associated_count = sidMapValue?.length ?? 1;
      });

      const extractedRes: PersonListItem[] = Array.from(
        allProfileIdMapRef.current.values()
      );

      setDataList(extractedRes);
      setDisplayList(extractedRes);
    },
    []
  );

  const onQueryAll = useCallback(async () => {
    setQueryLoading(true);
    try {
      const personListRes = await PersonService.queryAll();

      refreshDataList(personListRes);

      const storageQueryItem: StorageQueryItem = {
        dataList: personListRes,
        timeStamp: dayjs().unix(),
      };

      await StorageService.pushQueryDataList(storageQueryItem);

      console.log("personListRes", personListRes);
    } catch (e) {
      console.log(e);
    }
    setQueryLoading(false);
  }, []);

  return {
    sidMapRef,
    allProfileIdMapRef,
    rawDataMapRef,
    dataList,
    displayList,
    setDisplayList,
    refreshDataList,
    onQueryAll,
    queryLoading,
  };
};

export const useFilter = () => {};

export const useSelectedList = () => {
  const [selectedList, setSelectedList] = useState<
    PersonListItem["profile_id"][]
  >([]);

  return {
    selectedList,
    setSelectedList,
  };
};

export const useVisibleColumns = () => {
  /**
   * 显示的列名
   */
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    () => {
      return PERSON_LIST_COLUMNS.reduce((acc, col) => {
        acc[col.dataIndex as string] = true;
        return acc;
      }, {} as Record<string, boolean>);
    }
  );

  const onToggleColumns = useCallback(
    (dataIndex: string) => (e: CheckboxChangeEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setVisibleColumns((prev) => {
        return {
          ...prev,
          [dataIndex]: e.target.checked,
        };
      });
    },
    []
  );

  return {
    visibleColumns,
    onToggleColumns,
  };
};
