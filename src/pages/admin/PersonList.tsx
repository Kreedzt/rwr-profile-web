import React, {
  FC,
  forwardRef,
  MutableRefObject,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button, Table } from "antd";
import { PersonService } from "../../services/person";
import { PERSON_LIST_COLUMNS } from "./columns";
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

      const extractedRes: PersonListItem[] = personListRes.map((info) => ({
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
      }));
      setDataList(extractedRes);
      setDisplayList(extractedRes);
      console.log("personListRes", personListRes);
    } catch (e) {
      console.log(e);
    }
    setQueryLoading(false);
  }, []);

  const onQuery5Stars = useCallback(() => {
    setDisplayList(dataList.filter((item) => item.xp > 10));
  }, [dataList]);

  const onQueryUniqueBySid = useCallback(() => {
    const tempSet = new Set<String>();
    setDisplayList(
      dataList.filter((item) => {
        if (tempSet.has(item.sid)) {
          return false;
        }

        tempSet.add(item.sid);
        return true;
      })
    );
  }, [dataList]);

  const onCustomQuery = useCallback((query: QueryItem[]) => {
    console.log("queryItem", query);
  }, []);

  return (
    <div>
      <div className="quick-query-area">
        <Button loading={queryLoading} onClick={onQueryAll}>
          查询全部(先点我查询)
        </Button>
        <Button loading={queryLoading} onClick={onQuery5Stars}>
          过滤出所有五星人形
        </Button>
        <Button loading={queryLoading} onClick={onQueryUniqueBySid}>
          按 Steam ID 唯一过滤
        </Button>
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
        columns={PERSON_LIST_COLUMNS}
      />
      当前表格内数据总数: {displayList.length}
    </div>
  );
});

export default PersonList;
