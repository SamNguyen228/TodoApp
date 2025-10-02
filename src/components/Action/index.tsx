"use client";

import React, { useState } from "react";
import { Button, Popconfirm } from "antd";
import type { NotificationInstance } from "antd/es/notification/interface";
import { Todo, useTodoStore } from "@/stores/todoStore";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import FireworkCelebration from "@/components/FireworkCelebration";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TodoApi from "@/api/TodoApi";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/queryKeys";

interface ActionProps {
  notify: NotificationInstance;
}

export default function Action({ notify }: ActionProps) {
  const { selectedIds, setSelectedIds } = useTodoStore();
  const [showFirework, setShowFirework] = useState(false);
  const { t } = useTranslation()
  const queryClient = useQueryClient();

  const completeManyMutation = useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_TODO],
    mutationFn: (ids: number[]) => TodoApi.completeMany(ids),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
      setSelectedIds([]);
    },
  });

  const deleteManyMutation = useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_TODO],
    mutationFn: (ids: number[]) => TodoApi.deleteMany(ids),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
      setSelectedIds([]);
    },
  });

  // const allSelectedCompleted = false;

  const allTodos = queryClient
    .getQueriesData<{ content: Todo[] }>({ queryKey: [QUERY_KEYS.TODOS] })
    .flatMap(([_, data]) => data?.content ?? []);

  const allSelectedCompleted =
    selectedIds.length > 0 &&
    selectedIds.every((id) => allTodos.find((t) => t.id === id)?.completed);

  const handleComplete = () => {
    completeManyMutation.mutate(selectedIds);
    notify.success({
      message: t("notify.success"),
      description: t("notify.success_completed"),
    });

    setShowFirework(true);

    setTimeout(() => setShowFirework(false), 2000);
  };

  const handleDelete = () => {
    deleteManyMutation.mutate(selectedIds);
    notify.success({
      message: t("notify.delete"),
      description: t("notify.success_deleted"),
    });
  };

  return (
    <div className="flex gap-2 mb-4 relative">
      <Button
        color="green"
        variant="solid"
        className="hover:scale-110"
        disabled={selectedIds.length === 0 || allSelectedCompleted}
        onClick={handleComplete}
        icon={<CheckOutlined />}
      >
        {t("button.complete")}
      </Button>

      <Popconfirm
        title={t("prop_confirm.delete_confirm")}
        description={t("prop_confirm.delete_confirm_many", { count: selectedIds.length })}
        okText={t("button.delete_ok")}
        cancelText={t("button.cancel")}
        onConfirm={handleDelete}
      >
        <Button
          color="red"
          variant="solid"
          className="hover:scale-110"
          disabled={selectedIds.length === 0}
          icon={<DeleteOutlined />}
        >
          {t("button.delete")}
        </Button>
      </Popconfirm>

      {showFirework && <FireworkCelebration />}
    </div>
  );
}
