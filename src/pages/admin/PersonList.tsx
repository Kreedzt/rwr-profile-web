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
import { Button, Table, Modal } from "antd";
import { PersonService } from "../../services/person";
import { getLinkablePersonListColumns, PERSON_LIST_COLUMNS } from "./columns";
import { PersonListItem } from "./model";
import CustomQuery from "./CustomQuery";
import { QueryItem } from "./type";

export interface PersonListRef {
  getDisplayList: () => PersonListItem[];
  getCheckedList: () => number[];
}

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
     映射关系: [steamId, [profile_id]]
   */
  const steamIdMapRef = useRef<Map<string, number[]>>(new Map());
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

      steamIdMapRef.current.clear();
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
          associated_count: 1,
        };

        const steamIdMapValue = steamIdMapRef.current.get(resInfo.sid);

        if (steamIdMapValue === undefined) {
          steamIdMapRef.current.set(resInfo.sid, [resInfo.profile_id]);
        } else {
          steamIdMapRef.current.set(resInfo.sid, [
            ...steamIdMapValue,
            resInfo.profile_id,
          ]);
        }

        allProfileIdMapRef.current.set(resInfo.profile_id, resInfo);
      });

      allProfileIdMapRef.current.forEach((info) => {
        const steamIdMapValue = steamIdMapRef.current.get(info.sid);

        info.associated_count = steamIdMapValue?.length ?? 1;
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

  const onQuery5Stars = useCallback(() => {
    setDisplayList(
      Array.from(allProfileIdMapRef.current.values()).filter(
        (item) => item.xp > 10
      )
    );
  }, []);

  const onQueryUniqueBySid = useCallback(() => {
    /**
       steamId 唯一, 大号优先
     */
    const tempMap = new Map<string, PersonListItem>();

    allProfileIdMapRef.current.forEach((info) => {
      const tempMapRes = tempMap.get(info.sid);

      if (tempMapRes === undefined) {
        tempMap.set(info.sid, info);
        // 按游玩时间优先覆盖
      } else if (info.time_played > tempMapRes.time_played) {
        tempMap.set(info.sid, info);
      }
    });

    setDisplayList(Array.from(tempMap.values()));
  }, []);

  const onCustomQuery = useCallback((query: QueryItem[]) => {
    console.log("queryItem", query);
  }, []);

  const onQueryAssociatedModal = useCallback((targetSid: string) => {
    const profileIdList = steamIdMapRef.current.get(targetSid) ?? [];

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
    <div>
      <div className="quick-query-area">
        <div>
          <p>查询区域</p>
          <Button loading={queryLoading} type="primary" onClick={onQueryAll}>
            查询全部(先点我查询)
          </Button>
        </div>
        <div>
          <p>二次筛选区域</p>
          <Button loading={queryLoading} onClick={onQuery5Stars}>
            过滤出所有五星人形
          </Button>
          <Button loading={queryLoading} onClick={onQueryUniqueBySid}>
            按 Steam ID 唯一过滤(游玩时间优先)
          </Button>
        </div>
      </div>
      <div className="custom-query-area">
        <CustomQuery onQuery={onCustomQuery} />
      </div>
      <Table
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
        <div>
          <Table
            rowKey="profile_id"
            dataSource={modalOpt.personList}
            columns={PERSON_LIST_COLUMNS}
          />
          当前表格内数据总数: {modalOpt.personList.length}
        </div>
      </Modal>
    </div>
  );
});

export default PersonList;
