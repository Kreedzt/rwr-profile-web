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
  Skeleton,
} from "antd";
import { StashItem } from "../../models/person";
import { QuickItem } from "../../models/system";
import { SystemService } from "../../services/system";
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
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onClickItem = useCallback(
    (item: StashItem) => {
      onClickQuickItem(item);
    },
    [onClickQuickItem]
  );

  const onRefreshQuickItemsList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await SystemService.queryQuickItems();
      setQuickItemList(res);
      //
    } catch (e) {
      /* message.error() */
      console.dir(e);
    } finally {
      setLoading(false);
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
      message.success("保存成功");
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
      message.warn("表单提交失败");
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
        快捷操作区(快速添加一项物品)
        <div className="title-control">
          <Button type="default" onClick={onSwitchMode}>
            切换到{mode === "edit" ? "查看" : "编辑"}模式
          </Button>
          {mode === "edit" && (
            <>
              <Button type="default" onClick={() => onShowEditModal()}>
                + 添加
              </Button>
              <Button type="primary" onClick={onSaveQuickItemList}>
                保存
              </Button>
            </>
          )}
        </div>
      </Title>

      {loading ? (
        <Skeleton.Button active />
      ) : (
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
      )}

      <Modal
        title={`${recordItem ? "编辑" : "添加"}快捷操作项`}
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
                message: "请准确输入 class 值",
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              placeholder="请准确输入 class 值"
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
                message: "请准确输入 index 值",
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              placeholder="请准确输入 index 值"
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
                message: "请准确输入 key 值",
              },
            ]}
          >
            <Input placeholder="请准确输入 key 值" disabled={!!recordItem} />
          </Form.Item>
          <Form.Item
            name="label"
            label="标签名"
            required
            rules={[
              {
                required: true,
                message: "请输入标签名",
              },
            ]}
          >
            <Input placeholder="请输入标签名(仅展示用, 随便输入)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuickItems;
