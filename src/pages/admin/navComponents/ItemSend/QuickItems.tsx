// SPDX-License-Identifier: GPL-3.0-only
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  Typography,
  Button,
  Tag,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import { StashItem } from "../../../../models/person";
import { QuickItem } from "../../../../models/system";
import { SystemService } from "../../../../services/system";
import "./QuickItems.less";

const { Title } = Typography;

interface QuickItemsProps {
  onClickQuickItem: (item: StashItem) => void;
}

const QuickItems: FC<QuickItemsProps> = ({ onClickQuickItem }) => {
  const [quickItemList, setQuickItemList] = useState<QuickItem[]>([]);
  const [mode, setMode] = useState<"edit" | "view">("view");
  const [recordItem, setRecordItem] = useState<QuickItem | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const onClickItem = useCallback(
    (item: StashItem) => {
      onClickQuickItem(item);
    },
    [onClickQuickItem]
  );

  const onRefreshQuickItemsList = useCallback(async () => {
    try {
      const res = await SystemService.queryQuickItems();
      setQuickItemList(res);
      //
    } catch (e) {
      /* message.error() */
      console.dir(e);
    }
  }, []);

  const onSwitchMode = useCallback(() => {
    setMode((prev) => {
      return prev === "edit" ? "view" : "edit";
    });
  }, []);

  const onRemoveItem = useCallback((k: string) => {
    setQuickItemList((prev) => {
      return prev.filter((item) => item.key !== k);
    });
  }, []);

  const onShowEditModal = useCallback(
    (q?: QuickItem) => {
      setRecordItem(q);
      setModalVisible(true);
      form.setFieldsValue(
        q ?? {
          class: undefined,
          index: undefined,
          key: undefined,
          label: undefined,
        }
      );
    },
    [form]
  );

  const onSaveQuickItemList = useCallback(async () => {
    try {
      const res = await SystemService.updateQuickItems(quickItemList);
      console.log("onSaveQuickItemList:res", res);
      message.success("????????????");
    } catch (e) {
      console.dir(e);
    }
  }, [quickItemList]);

  const onFormFinish = useCallback(
    (values: QuickItem) => {
      if (recordItem?.key) {
        setQuickItemList((prev) => {
          return prev.map((item) => {
            if (item.key === values.key) {
              return values;
            }

            return item;
          });
        });
      } else {
        setQuickItemList((prev) => {
          return [...prev, values];
        });
      }

      setModalVisible(false);
    },
    [recordItem?.key]
  );

  const onModalOk = useCallback(async () => {
    try {
      const res = await form.validateFields();
      console.log("form validateFields res:", res);
      form.submit();
    } catch (e) {
      message.warn("??????????????????");
      console.dir(e);
    }
  }, [form]);

  const onModalCancel = useCallback(() => {
    setModalVisible(false);
    form.resetFields();
  }, [form]);

  useEffect(() => {
    onRefreshQuickItemsList();
  }, []);

  return (
    <div className="quick-control-area">
      <Title className="quick-title" level={5}>
        ???????????????(????????????????????????)
        <div className="title-control">
          <Button type="default" onClick={onSwitchMode}>
            ?????????{mode === "edit" ? "??????" : "??????"}??????
          </Button>
          {mode === "edit" && (
            <>
              <Button type="default" onClick={() => onShowEditModal()}>
                + ??????
              </Button>
              <Button type="primary" onClick={onSaveQuickItemList}>
                ??????
              </Button>
            </>
          )}
        </div>
      </Title>

      <div className="quick-btn-list">
        {mode === "view" &&
          quickItemList.map((c) => {
            const { label, ...stashInfo } = c;
            return (
              <Button key={c.key} onClick={() => onClickItem(stashInfo)}>
                {label}
              </Button>
            );
          })}
        {mode === "edit" &&
          quickItemList.map((c) => {
            return (
              <Tag
                key={c.key}
                closable
                onClick={() => onShowEditModal(c)}
                onClose={() => onRemoveItem(c.key)}
              >
                {c.label}
              </Tag>
            );
          })}
      </div>

      <Modal
        title={`${recordItem ? "??????" : "??????"}???????????????`}
        visible={modalVisible}
        onOk={onModalOk}
        onCancel={onModalCancel}
      >
        <Form form={form} onFinish={onFormFinish}>
          <Form.Item
            name="class"
            label="class"
            required
            rules={[
              {
                required: true,
                message: "??????????????? class ???",
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              placeholder="??????????????? class ???"
              disabled={!!recordItem}
            />
          </Form.Item>
          <Form.Item
            name="index"
            label="index"
            required
            rules={[
              {
                required: true,
                message: "??????????????? index ???",
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              placeholder="??????????????? index ???"
              disabled={!!recordItem}
            />
          </Form.Item>
          <Form.Item
            name="key"
            label="Key"
            required
            rules={[
              {
                required: true,
                message: "??????????????? key ???",
              },
            ]}
          >
            <Input placeholder="??????????????? key ???" disabled={!!recordItem} />
          </Form.Item>
          <Form.Item
            name="label"
            label="?????????"
            required
            rules={[
              {
                required: true,
                message: "??????????????????",
              },
            ]}
          >
            <Input placeholder="??????????????????(????????????, ????????????)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuickItems;
