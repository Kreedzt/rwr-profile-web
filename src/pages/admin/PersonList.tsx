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
import { Button, Table, Modal, Typography } from "antd";
import { PersonService } from "../../services/person";
import { getLinkablePersonListColumns, PERSON_LIST_COLUMNS } from "./columns";
import { PersonListItem } from "./model";
import CustomQuery from "./personListComponents/CustomQuery/CustomQuery";
import { QueryItem, QueryModeEnum } from "./type";
import { parseQueryList } from "./parse";
import CodeQuery from "./personListComponents/CodeQuery/CodeQuery";
import "./PersonList.less";
import QuickQuery from "./personListComponents/QuickQuery/QuickQuery";
import AsscociateNames from "./personListComponents/AssociateNames/AsscociateNames";

export interface PersonListRef {
  getDisplayList: () => PersonListItem[];
  getCheckedList: () => number[];
}

const { Paragraph, Text, Title } = Typography;

export const usePersonListRef = (): MutableRefObject<PersonListRef | null> =>
  useRef(null);

const PersonList = forwardRef<PersonListRef>((_props, ref) => {
  const [queryLoading, setQueryLoading] = useState(false);
  const [dataList, setDataList] = useState<PersonListItem[]>([]);
  const [displayList, setDisplayList] = useState<PersonListItem[]>([]);
  const [selectedList, setSelectedList] = useState<
    PersonListItem["profile_id"][]
  >([]);
  const [modalOpt, setModalOpt] = useState<{
    visible: boolean;
    personList: PersonListItem[];
  }>({
    visible: false,
    personList: [],
  });
  /**
     映射关系: [sid, [profile_id]]
   */
  const sidMapRef = useRef<Map<string, number[]>>(new Map());
  const allProfileIdMapRef = useRef<Map<number, PersonListItem>>(new Map());

  useImperativeHandle(
    ref,
    () => ({
      getDisplayList: () => displayList,
      getCheckedList: () => selectedList,
    }),
    [displayList, selectedList]
  );

  const onQueryAll = useCallback(async () => {
    setQueryLoading(true);
    try {
      const personListRes = await PersonService.queryAll();

      sidMapRef.current.clear();
      allProfileIdMapRef.current.clear();

      personListRes.forEach((info) => {
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
      console.log("personListRes", personListRes);
    } catch (e) {
      console.log(e);
    }
    setQueryLoading(false);
  }, []);

  const onQuickQuery = useCallback((filterCb) => {
    setDisplayList((prev) => filterCb(prev));
  }, []);

  const onClearQuery = useCallback(() => {
    setDisplayList(Array.from(allProfileIdMapRef.current.values()));
  }, []);

  const onCustomQuery = useCallback(
    (query: QueryItem[], mode: QueryModeEnum) => {
      setDisplayList((prev) => {
        return prev.filter((info) => {
          return parseQueryList(info, query, mode);
        });
      });
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

    setModalOpt({
      visible: true,
      personList: modalPersonList,
    });
  }, []);

  const linkableColumns = useMemo(() => {
    return getLinkablePersonListColumns(onQueryAssociatedModal);
  }, [onQueryAssociatedModal]);

  return (
    <div className="person-list">
      <div className="quick-query-area">
        <div className="main-area">
          <Title level={5}>查询区域</Title>
          <div className="btn-list">
            <Button loading={queryLoading} type="primary" onClick={onQueryAll}>
              查询全部(先点我查询)
            </Button>
            <Button loading={queryLoading} danger onClick={onClearQuery}>
              清空所有筛选
            </Button>
          </div>
        </div>
        <QuickQuery loading={queryLoading} onQuery={onQuickQuery} />
      </div>
      <div className="custom-query-area">
        <CustomQuery loading={queryLoading} onQuery={onCustomQuery} />
      </div>
      <div className="code-query-area">
        <CodeQuery loading={queryLoading} onQuery={onCodeQuery} />
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
        visible={modalOpt.visible}
        onCancel={() => {
          setModalOpt({
            visible: false,
            personList: [],
          });
        }}
        title="查询关联用户名"
        footer={null}
      >
        <AsscociateNames personList={modalOpt.personList} />
      </Modal>
    </div>
  );
});

export default PersonList;
