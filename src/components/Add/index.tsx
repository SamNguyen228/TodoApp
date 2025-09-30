import { Input, Button, DatePicker, Select } from "antd";
import type { SelectProps } from "antd";
import dayjs from "dayjs";
import { type Priority } from "@/stores/todoStore";
import { PlusCircleTwoTone } from "@ant-design/icons";
import React, { useState } from "react";
import { NotificationInstance } from "antd/es/notification/interface";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TodoApi from "@/api/TodoApi";
import { MUTATION_KEYS } from "@/constants/queryKeys";
import { QUERY_KEYS } from "@/constants/queryKeys";

interface InputAddProps {
  notify: NotificationInstance;
}

export default function InputAdd({ notify }: InputAddProps) {
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_TODO],
    mutationFn: (payload: { title: string; deadline: string | null; priority: Priority }) =>
      TodoApi.createTodo(payload.title, payload.deadline, payload.priority),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
    },
  });

  const priorityOptions: SelectProps<Priority>["options"] = [
    { value: "Low", label: t("priority.low") },
    { value: "Medium", label: t("priority.medium") },
    { value: "High", label: t("priority.high") },
    {
      value: "Critical",
      label: <span className="text-red-500 font-semibold">{t("priority.critical")}</span>,
    },
  ];

  const handleAdd = async () => {
    if (!newTodo.trim()) {
      notify.warning({
        message: t("notify.warning"),
        description: t("notify.warning_blank"),
      });
      return;
    }

    try {
      setLoading(true);
      await createMutation.mutateAsync({
        title: newTodo,
        deadline: deadline ? deadline.toISOString() : null,
        priority,
      });

      notify.success({
        message: t("notify.success"),
        description: t("notify.add_success"),
      });

      setNewTodo("");
      setDeadline(null);
      setPriority("Medium");
    } catch (err: unknown) {
      if (err instanceof Error) {
        notify.error({
          message: t("notify.error"),
          description: err.message,
        });
      } else {
        notify.error({
          message: t("notify.error"),
          description:  t("notify.error_add_failed"),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <Input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder={t("add_todo.placeholder")}
        onPressEnter={handleAdd}
        autoFocus
      />
      <DatePicker
        value={deadline}
        onChange={(value) => setDeadline(value)}
        showTime
        format="DD-MM-YYYY HH:mm"
        placeholder={t("add_todo.deadline")}
        className="w-100"
      />
      <Select
        value={priority}
        onChange={(val) => setPriority(val)}
        options={priorityOptions}
        style={{ width: 240 }}
      />
      <Button
        type="primary"
        onClick={handleAdd}
        icon={<PlusCircleTwoTone />}
        loading={loading}
        className="hover:scale-105"
      >
        {t("add_todo.add_button")}
      </Button>
    </div>
  );
}
