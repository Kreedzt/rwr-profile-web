import React, { FC, useCallback, useState } from "react";
import { Button, message, Modal, Typography, Input } from "antd";
import { PersonListItem } from "./model";
import "./CodeQuery.less";

const { Title } = Typography;
const { TextArea } = Input;

type CodeQueryProps = {
  loading: boolean;
  onQuery: (filterFn: (info: PersonListItem) => boolean) => void;
};

const INITIAL_CODE = `return function(info) {
  return true;
}`;

const MOCK_DATA: PersonListItem = {
  profile_id: 0,
  username: "",
  xp: 0,
  rp: 0,
  squad_tag: "",
  sid: "",
  time_played: 0,
  kills: 0,
  deaths: 0,
  player_kills: 0,
  associated_count: 0,
};

const CodeQuery: FC<CodeQueryProps> = ({ loading, onQuery }) => {
  const [codeText, setCodeText] = useState<string>(INITIAL_CODE);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onCodeQuery = useCallback(() => {
    try {
      const filterFn = new Function(codeText)();
      // 执行测试
      filterFn(MOCK_DATA);
      onQuery(filterFn);
    } catch (e) {
      message.error(`代码不合法！`);
      console.dir(e);
    }
  }, [onQuery, codeText]);

  const onReset = useCallback(() => {
    setCodeText(INITIAL_CODE);
  }, []);

  return (
    <div className="code-query">
      <Title level={5}>自定义代码筛选区域(基于表格数据)</Title>
      <div className="top-btn-control">
        <Button type="primary" loading={loading} onClick={onCodeQuery}>
          执行自定义代码查询(JavaScript)
        </Button>
        <Button onClick={() => setModalVisible(true)}>编辑自定义代码</Button>
        <Button onClick={onReset} danger>
          重置代码
        </Button>
      </div>
      <Modal
        title="编辑自定义查询代码"
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <div>
          <div className="desc">
            参数 info 的结构说明:
            <p>
              注意: 值类型可能会改变, 尽量先转为字符串再比较(toString() 方法)
            </p>
          </div>
          <code>
            <pre>
              <p>profile_id: number; // 存档ID</p>
              <p>username: string; // 用户名</p>
              <p>xp: number; // XP</p>
              <p>rp: number; // RP</p>
              <p>squad_tag: string; // 小队名称</p>
              <p>sid: string; // Steam ID</p>
              <p>time_played: number; // 游玩时间</p>
              <p>kills: number; // 击杀数</p>
              <p>deaths: number; // 死亡数</p>
              <p>player_kills: number; // 玩家击杀数</p>
              <p>associated_count: number; // 关联用户名数量</p>
            </pre>
          </code>
          <TextArea
            className="code-input"
            value={codeText}
            onChange={(e) => setCodeText(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default CodeQuery;
