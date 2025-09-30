import React from "react";
import { Modal, Input, DatePicker, Select } from "antd";
import { useTodoStore } from "@/stores/todoStore";
import dayjs, { Dayjs } from "dayjs";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { Priority } from "@/stores/todoStore";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TodoApi from "@/api/TodoApi";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/queryKeys";

interface EditModalProps {
  notify: NotificationInstance;
}

export default function EditModal({ notify }: EditModalProps) {
  const { editing, setEditing } = useTodoStore();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_TODO],
    mutationFn: (payload: { id: number; title: string; deadline: string | null; priority: Priority }) =>
      TodoApi.updateTodo(payload.id, { title: payload.title, deadline: payload.deadline, priority: payload.priority }),
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
    <Modal
      open={!!editing}
      okText="Lưu"
      cancelText="Hủy"
      onCancel={() => setEditing(null)}
      onOk={handleOk}
    >
      <div className="mb-3">
        <label className="block mb-1 font-medium">{t("title.task_name")}</label>
        <Input
          value={editing?.title}
          onChange={(e) =>
            setEditing(
              editing ? { ...editing, title: e.target.value } : null
            )
          }
          onPressEnter={handleOk}
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium">{t("title.deadline")}</label>
        <DatePicker
          showTime
          format="DD-MM-YYYY HH:mm"
          value={editing?.deadline ? dayjs(editing.deadline) : null}
          onChange={(date: Dayjs | null) =>
            setEditing(
              editing
                ? { ...editing, deadline: date?.toISOString() ?? null }
                : null
            )
          }
          className="w-full"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium">{t("title.priority")}</label>
        <Select<Priority>
          value={editing?.priority || "Medium"}
          onChange={(val) =>
            setEditing(editing ? { ...editing, priority: val } : null)
          }
          options={[
            { value: "Low", label: "Low" },
            { value: "Medium", label: "Medium" },
            { value: "High", label: "High" },
            { value: "Critical", label: "Critical" },
          ]}
          className="w-full"
        />
      </div>
    </Modal>
  );
}
