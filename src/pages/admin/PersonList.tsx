// SPDX-License-Identifier: GPL-3.0-only
import React, {
  FC,
  forwardRef,
  MutableRefObject,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Table,
  Modal,
  Typography,
  message,
  Dropdown,
  Space,
  Menu,
  Checkbox,
  Popover,
} from "antd";
import { PersonService } from "../../services/person";
import { getLinkablePersonListColumns, PERSON_LIST_COLUMNS } from "./columns";
import { PersonListItem } from "./model";
import CustomQuery from "./personListComponents/CustomQuery/CustomQuery";
import { QueryItem, QueryModeEnum } from "./type";
import { parseQueryList } from "./util";
import CodeQuery from "./personListComponents/CodeQuery/CodeQuery";
import QuickQuery from "./personListComponents/QuickQuery/QuickQuery";
import AsscociateNames from "./personListComponents/AssociateNames/AsscociateNames";
import ProfileData from "./personListComponents/ProfileData/ProfileData";
import { Person } from "../../models/person";
import { Profile } from "../../models/profile";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { StorageQueryItem } from "../../models/query";
import MainQueryArea from "./personListComponents/MainQueryArea/MainQueryArea";
import {
  useQueryList,
  useSelectedList,
  useStorageQueryList,
  useVisibleColumns,
} from "./hook";
import "./PersonList.less";
import {TABLE_DATA_REFRESH_SUCCESS} from "./constant";

export interface PersonListRef {
  getDisplayList: () => PersonListItem[];
  getCheckedList: () => number[];
}

const { Paragraph, Text, Title } = Typography;

export const usePersonListRef = (): MutableRefObject<PersonListRef | null> =>
  useRef(null);

const PersonList = forwardRef<PersonListRef>((_props, ref) => {
  const { selectedList, setSelectedList } = useSelectedList();

  const { storageList, storageCount, refreshStorageList, clearStorageList } =
    useStorageQueryList();

  const {
    dataList,
    displayList,
    setDisplayList,
    refreshDataList,
    onQueryAll,
    onQueryItem,
    queryLoading,
    allProfileIdMapRef,
    sidMapRef,
    rawDataMapRef,
  } = useQueryList(refreshStorageList);

  const { visibleColumns, onToggleColumns } = useVisibleColumns();

  const [associateModalOpt, setAssociateModalOpt] = useState<{
    visible: boolean;
    personList: PersonListItem[];
  }>({
    visible: false,
    personList: [],
  });
  const [dataModalOpt, setDataModalOpt] = useState<{
    visible: boolean;
    data?: [number, Person, Profile];
  }>({
    visible: false,
  });

  useImperativeHandle(
    ref,
    () => ({
      getDisplayList: () => displayList,
      getCheckedList: () => selectedList,
    }),
    [displayList, selectedList]
  );

  const onQuickQuery = useCallback(
    (filterCb) => {
      setDisplayList(filterCb(dataList));

      message.success(TABLE_DATA_REFRESH_SUCCESS);
    },
    [dataList]
  );

  const onClearQuery = useCallback(() => {
    setDisplayList(Array.from(allProfileIdMapRef.current.values()));

    message.success(TABLE_DATA_REFRESH_SUCCESS);
  }, []);

  const onCustomQuery = useCallback(
    (query: QueryItem[], mode: QueryModeEnum) => {
      setDisplayList((prev) => {
        return prev.filter((info) => {
          return parseQueryList(info, query, mode);
        });
      });

      message.success(TABLE_DATA_REFRESH_SUCCESS);
    },
    []
  );

  const onCodeQuery = useCallback(
    (filterFn: (info: PersonListItem) => boolean) => {
      setDisplayList((prev) => {
        return prev.filter((info) => {
          return filterFn(info);
        });
      });

      message.success(TABLE_DATA_REFRESH_SUCCESS);
    },
    []
  );

  const onQueryAssociatedModal = useCallback((targetSid: string) => {
    const profileIdList = sidMapRef.current.get(targetSid) ?? [];

    const modalPersonList: PersonListItem[] = [];

    profileIdList.forEach((id) => {
      const personItem = allProfileIdMapRef.current.get(id);
      if (!personItem) return;
      modalPersonList.push(personItem);
    });

    setAssociateModalOpt({
      visible: true,
      personList: modalPersonList,
    });
  }, []);

  const onViewProfileData = useCallback((data: PersonListItem) => {
    const mapData = rawDataMapRef.current.get(data.profile_id);

    if (!mapData) {
      message.warn("未找到用户数据");
      return;
    }
    setDataModalOpt({
      visible: true,
      data: [data.profile_id, ...mapData],
    });
  }, []);

  const onUseStorage = useCallback((data: StorageQueryItem["dataList"]) => {
    refreshDataList(data);
  }, []);

  const onDataModalRefresh = useCallback(async (id: number) => {
    const res = await onQueryItem(id);
    setDataModalOpt((prev) => ({
      ...prev,
      data: res,
    }));
  }, [onQueryItem]);

  const linkableColumns = useMemo(() => {
    return getLinkablePersonListColumns(
      onQueryAssociatedModal,
      onViewProfileData
    ).filter((col, index) => {
      if (col.title === "操作") {
        return true;
      }
      return visibleColumns[col.dataIndex as string];
    });
  }, [onQueryAssociatedModal, onViewProfileData, visibleColumns]);

  return (
    <div className="person-list">
      <div className="quick-query-area">
        <MainQueryArea
          queryLoading={queryLoading}
          onQueryAll={onQueryAll}
          onClearQuery={onClearQuery}
          storageList={storageList}
          storageCount={storageCount}
          onUseStorage={onUseStorage}
          onClearStorage={clearStorageList}
        />
        <QuickQuery loading={queryLoading} onQuery={onQuickQuery} />
      </div>
      <div className="custom-query-area">
        <CustomQuery loading={queryLoading} onQuery={onCustomQuery} />
      </div>
      <div className="code-query-area">
        <CodeQuery loading={queryLoading} onQuery={onCodeQuery} />
      </div>
      <div className="table-toolbar">
        <Popover
          trigger={["click"]}
          title="勾选来显示列"
          content={
            <div
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {PERSON_LIST_COLUMNS.map((col) => (
                <div key={col.key}>
                  <Checkbox
                    checked={visibleColumns[col.dataIndex as string]}
                    onChange={onToggleColumns(col.dataIndex as string)}
                  >
                    {col.title}
                  </Checkbox>
                </div>
              ))}
            </div>
          }
        >
          <Button>显示/隐藏列</Button>
        </Popover>
      </div>
      <Table
        className="person-table"
        rowSelection={{
          selectedRowKeys: selectedList,
          onChange: (nextSelectedKeys) => {
            console.log("nextSelectedKeys", nextSelectedKeys);
            setSelectedList(nextSelectedKeys as number[]);
          },
        }}
        loading={queryLoading}
        rowKey="profile_id"
        dataSource={displayList}
        columns={linkableColumns}
      />
      当前表格内数据总数: {displayList.length}
      <Modal
        width="80vw"
        style={{
          overflow: "auto",
        }}
        visible={associateModalOpt.visible}
        onCancel={() => {
          setAssociateModalOpt({
            visible: false,
            personList: [],
          });
        }}
        title="查询关联用户名"
        footer={null}
      >
        <AsscociateNames personList={associateModalOpt.personList} />
      </Modal>
      <Modal
        width="80vw"
        visible={dataModalOpt.visible}
        style={{
          overflow: "auto",
        }}
        title="查询存档数据"
        onCancel={() => {
          setDataModalOpt({
            visible: false,
          });
        }}
        footer={null}
      >
        <ProfileData data={dataModalOpt.data} onRefresh={onDataModalRefresh} />
      </Modal>
    </div>
  );
});

export default PersonList;
