import React from "react";
import { Modal, Input, Select, ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import jaJP from "antd/locale/ja_JP";
import deDE from "antd/locale/de_DE";
import { useTodoStore } from "@/stores/todoStore";
import dayjs from "dayjs";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { Priority } from "@/stores/todoStore";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TodoApi from "@/api/TodoApi";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/queryKeys";
import LocalizedDatePicker from "../LocalizedDatePicker";

interface EditModalProps {
  notify: NotificationInstance;
}

export default function EditModal({ notify }: EditModalProps) {
  const { editing, setEditing } = useTodoStore();
  const { i18n, t } = useTranslation();
  const queryClient = useQueryClient();

  let locale;
  switch (i18n.language) {
    case "vi":
      locale = viVN;
      break;
    case "ja":
      locale = jaJP;
      break;
    case "de":
      locale = deDE;
      break;
    default:
      locale = undefined;
  }

  const updateMutation = useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_TODO],
    mutationFn: (payload: {
      id: number;
      title: string;
      deadline: string | null;
      priority: Priority;
    }) =>
      TodoApi.updateTodo(payload.id, {
        title: payload.title,
        deadline: payload.deadline,
        priority: payload.priority,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
    },
  });

  const handleOk = () => {
    if (editing && editing.title.trim()) {
      if (editing.deadline && dayjs(editing.deadline).isBefore(dayjs())) {
        notify.error({
          message: t("notify.error"),
          description: t("notify.error_overdue_dealine"),
        });
        return;
      }

      updateMutation.mutate({
        id: editing.id,
        title: editing.title,
        deadline: editing.deadline,
        priority: editing.priority,
      });
      setEditing(null);
      notify.success({
        message: t("notify.success"),
        description: t("notify.update_task_success"),
      });
    } else {
      notify.warning({
        message: t("notify.warning"),
        description: t("notify.warning_blank"),
      });
    }
  };

  return (
    <ConfigProvider locale={locale}>
      <Modal
        open={!!editing}
        okText={t("button.save")}
        cancelText={t("button.cancel")}
        onCancel={() => setEditing(null)}
        onOk={handleOk}
      >
        <div className="mb-3">
          <label className="block mb-1 font-medium">
            {t("title.task_name")}
          </label>
          <Input
            value={editing?.title}
            onChange={(e) =>
              setEditing(editing ? { ...editing, title: e.target.value } : null)
            }
            onPressEnter={handleOk}
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">
            {t("title.deadline")}
          </label>
          <LocalizedDatePicker
            value={editing?.deadline ? dayjs(editing.deadline) : null}
            onChange={(date) =>
              setEditing(
                editing
                  ? { ...editing, deadline: date?.toISOString() ?? null }
                  : null
              )
            }
            placeholder={t("title.select_date")}
            className="w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">
            {t("title.priority")}
          </label>
          <Select<Priority>
            value={editing?.priority || "Medium"}
            onChange={(val) =>
              setEditing(editing ? { ...editing, priority: val } : null)
            }
            options={[
              { value: "Low", label: t("priority.low") },
              { value: "Medium", label: t("priority.medium") },
              { value: "High", label: t("priority.high") },
              { value: "Critical", label: t("priority.critical") },
            ]}
            className="w-full"
          />
        </div>
      </Modal>
    </ConfigProvider>
  );
}
