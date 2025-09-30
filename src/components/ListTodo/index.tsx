import React, { useEffect } from "react";
import { Table, Button, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useTodoStore, type Todo, type Priority } from "@/stores/todoStore";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { NotificationInstance } from "antd/es/notification/interface";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TodoApi from "@/api/TodoApi";
import { QUERY_KEYS, MUTATION_KEYS } from "@/constants/queryKeys";

interface ListTodoProps {
  notify: NotificationInstance;
}

export default function ListTodo({ notify }: ListTodoProps) {
  const {
    filter,
    selectedIds,
    search,
    setSelectedIds,
    setEditing,
    currentPage,
    pageSize,
    sortField,
    sortOrder,
  } = useTodoStore();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [
      QUERY_KEYS.TODOS,
      {
        page: currentPage,
        size: pageSize,
        filter,
        search,
        sortField,
        sortOrder,
      },
    ],
    queryFn: () =>
      TodoApi.getTodos(
        currentPage - 1,
        pageSize,
        filter,
        search,
        sortField,
        sortOrder
      ),
    placeholderData: (prev) => prev,
  });

  const deleteTodoMutation = useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_TODO],
    mutationFn: (id: number) => TodoApi.deleteTodo(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
    },
  });

  const autoCompleteMutation = useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_TODO],
    mutationFn: () => TodoApi.autoCompleteOverdue(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
    },
  });

  const handleDelete = (id: number) => {
    deleteTodoMutation.mutate(id);
    notify.success({
      message: "Success",
      description: "Task has been removed from the list",
    });
  };

  const priorityWeight: Record<Priority, number> = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4,
  };

  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      autoCompleteMutation.mutate();
    }, 30 * 1000);
    return () => clearInterval(timer);
  }, [autoCompleteMutation]);

  const columns: ColumnsType<Todo> = [
    {
      title: t("list_todo.task"),
      dataIndex: "title",
      align: "center",
      render: (text: string, record: Todo) => (
        <span
          className={`${record.completed ? "line-through text-gray-400" : ""}`}
        >
          {text}
        </span>
      ),
    },
    {
      title: t("list_todo.created_at"),
      dataIndex: "createdAt",
      align: "center",
      render: (date: string) =>
        date ? (
          <div className="flex flex-col items-center">
            <span>{dayjs(date).format("DD/MM/YYYY")}</span>
            <span className="text-xs text-gray-500">
              {dayjs(date).format("HH:mm")}
            </span>
          </div>
        ) : (
          "—"
        ),
    },
    {
      title: t("list_todo.deadline"),
      dataIndex: "deadline",
      align: "center",
      sorter: (a, b) => {
        const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        return da - db;
      },
      render: (date: string | null | undefined, record: Todo) => {
        if (!date)
          return (
            <span className="text-gray-400">{t("list_todo.no_deadline")}</span>
          );

        const deadlinePassed = record.expired || record.autoCompleted;

        let style = "";
        if (record.completed && !record.expired && !record.autoCompleted) {
          style = "text-gray-400";
        } else if (deadlinePassed) {
          style = "text-red-500 font-bold";
        }

        return (
          <div className={`flex flex-col items-center ${style}`}>
            <span>{dayjs(date).format("DD/MM/YYYY")}</span>
            <span className="text-xs">{dayjs(date).format("HH:mm")}</span>
          </div>
        );
      },
    },
    {
      title: t("list_todo.priority"),
      dataIndex: "priority",
      align: "center",
      sorter: (a, b) => priorityWeight[a.priority] - priorityWeight[b.priority],
      render: (priority: Priority) => {
        let color = "";
        switch (priority) {
          case "Low":
            color = "text-green-500";
            break;
          case "Medium":
            color = "text-blue-500";
            break;
          case "High":
            color = "text-orange-500";
            break;
          case "Critical":
            color = "text-red-600 font-bold";
            break;
        }

        const priorityKey: Record<Priority, string> = {
          Low: "priority.low",
          Medium: "priority.medium",
          High: "priority.high",
          Critical: "priority.critical",
        };

        return <span className={color}>{t(priorityKey[priority])}</span>;
      },
    },

    {
      title: t("list_todo.actions"),
      align: "center",
      render: (record: Todo) => (
        <>
          <Button
            type="link"
            onClick={() =>
              setEditing({
                id: record.id,
                title: record.title,
                deadline: record.deadline || null,
                priority: record.priority,
              })
            }
            icon={<EditOutlined />}
            disabled={record.completed}
          />
          <Popconfirm
            title={t("prop_confirm.delete_confirm")}
            description={t("prop_confirm.delete_confirm_one")}
            okText={t("button.delete_ok")}
            cancelText={t("button.cancel")}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger type="link" icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedIds as number[],
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedIds(selectedRowKeys as number[]);
    },
  };

  return (
    <div>
      <Table<Todo>
        bordered
        loading={isLoading}
        dataSource={data?.content ?? []}
        columns={columns}
        rowSelection={rowSelection}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data?.totalElements ?? 0,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          onChange: (page, size) => {
            useTodoStore.setState({
              currentPage: page,
              pageSize: size || pageSize,
            });
          },
          position: ["bottomCenter"],
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(pagination, filters, sorter: any) => {
          useTodoStore.setState({
            currentPage: pagination.current ?? 1,
            pageSize: pagination.pageSize ?? pageSize,
            sortField: sorter.field || "createdAt",
            sortOrder: sorter.order || "descend",
          });
        }}
      />
    </div>
  );
}
