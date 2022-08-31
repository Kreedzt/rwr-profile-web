// SPDX-License-Identifier: GPL-3.0-only
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PersonListItem } from "./model";
import { Person } from "../../models/person";
import { Profile } from "../../models/profile";
import { PersonService } from "../../services/person";
import { PERSON_LIST_COLUMNS } from "./columns";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { StorageService } from "../../services/storage";
import { StorageQueryItem } from "../../models/query";
import dayjs from "dayjs";
import { transformToPersonListItem } from "./util";
import { ProfileService } from "../../services/profile";

export const useQueryList = (queryCallBack: () => void) => {
  const [queryLoading, setQueryLoading] = useState(false);
  const [dataList, setDataList] = useState<PersonListItem[]>([]);

  const [displayList, setDisplayList] = useState<PersonListItem[]>([]);

  /**
     映射关系: [sid, [profile_id]]
     */
  const sidMapRef = useRef<Map<string, number[]>>(new Map());
  const allProfileIdMapRef = useRef<Map<number, PersonListItem>>(new Map());
  const rawDataMapRef = useRef<Map<number, [Person, Profile]>>(new Map());

  const refreshDataItem = useCallback((data: [number, Person, Profile]) => {
    const resInfo = transformToPersonListItem(...data);

    allProfileIdMapRef.current.set(resInfo.profile_id, resInfo);
    rawDataMapRef.current.set(data[0], [data[1], data[2]]);

    const extractedRes: PersonListItem[] = Array.from(
      allProfileIdMapRef.current.values()
    );

    setDataList(extractedRes);
    setDataList(extractedRes);
  }, []);

  const refreshDataList = useCallback(
    (dataList: Array<[number, Person, Profile]>) => {
      sidMapRef.current.clear();
      allProfileIdMapRef.current.clear();
      rawDataMapRef.current.clear();

      dataList.forEach((info) => {
        const resInfo = transformToPersonListItem(...info);

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

      queryCallBack();

      console.log("personListRes", personListRes);
    } catch (e) {
      console.log(e);
    }
    setQueryLoading(false);
  }, []);

  const onQueryItem = useCallback(async (profileId: number) => {
    const [profile, person] = await Promise.all([
      ProfileService.query(profileId),
      PersonService.query(profileId),
    ]);

    const concatData: [number, Person, Profile] = [profileId, person, profile];

    refreshDataItem(concatData);

    return concatData;
  }, [refreshDataItem]);

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
    onQueryItem,
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

export const useStorageQueryList = () => {
  const [storageList, setStorageList] = useState<StorageQueryItem[]>([]);

  const storageCount = useMemo(() => {
    return storageList.length;
  }, [storageList]);

  const refreshStorageList = useCallback(async () => {
    const res = await StorageService.getQueryDataList();
    setStorageList(res ?? []);
  }, []);

  const clearStorageList = useCallback(async () => {
    await StorageService.clearQueryDataList();
    setStorageList([]);
  }, []);

  useEffect(() => {
    refreshStorageList();
  }, []);

  return {
    storageList,
    storageCount,
    refreshStorageList,
    clearStorageList,
  };
};
