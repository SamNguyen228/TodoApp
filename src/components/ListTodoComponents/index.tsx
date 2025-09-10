import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useTodoStore, type Todo } from "@/stores/todoStore";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { NotificationInstance } from "antd/es/notification/interface";

interface ListTodoProps {
    notify: NotificationInstance;
}

export default function ListTodo({ notify }: ListTodoProps) {
    const {
        filter,
        todos,
        selectedIds,
        search,
        deleteTodo,
        setSelectedIds,
        setEditing,
        checkExpired,
    } = useTodoStore();

    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredTodos = todos.filter((todo) => {
        if (filter === "completed" && !todo.completed) return false;
        if (filter === "active" && todo.completed) return false;
        if (search && !todo.text.toLowerCase().includes(search.toLowerCase()))
            return false;
        return true;
    });

    const handleDelete = (id: number) => {
        deleteTodo(id);
        notify.success({
            message: "Success",
            description: "Task has been removed from the list",
        });
    };

    const priorityWeight: Record<Todo["priority"], number> = {
        Low: 1,
        Medium: 2,
        High: 3,
        Critical: 4,
    };

    useEffect(() => {
        const timer = setInterval(() => {
            checkExpired();
        }, 30 * 1000);
        return () => clearInterval(timer);
    }, [checkExpired]);

    const columns: ColumnsType<Todo> = [
        {
            title: "TASK",
            dataIndex: "text",
            align: "center",
            render: (text, record) => (
                <span
                    className={`${record.completed ? "line-through text-gray-400" : ""}`}
                >
                    {text}
                </span>
            ),
        },
        {
            title: "CREATED AT",
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
            title: "DEADLINE",
            dataIndex: "deadline",
            align: "center",
            sorter: (a, b) => {
                const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
                const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
                return da - db;
            },
            render: (date: string, record) => {
                if (!date) return <span className="text-gray-400">No deadline</span>;

                const deadlinePassed = new Date(date).getTime() < Date.now();

                let style = "";
                if (record.completed && !record.expired) {
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
            title: "PRIORITY",
            dataIndex: "priority",
            align: "center",
            sorter: (a, b) =>
                priorityWeight[a.priority] - priorityWeight[b.priority],
            render: (priority: string) => {
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
                return <span className={color}>{priority}</span>;
            },
        },
        {
            title: "ACTIONS",
            align: "center",
            render: (record) => (
                <>
                    <Button
                        type="link"
                        onClick={() =>
                            setEditing({
                                id: record.id,
                                text: record.text,
                                deadline: record.deadline || null,
                                priority: record.priority || "Medium",
                            })
                        }
                        key="edit"
                        icon={<EditOutlined />}
                        disabled={record.completed}
                    />
                    <Popconfirm
                        title="Confirm deletion"
                        description="Are you sure you want to delete this task?"
                        okText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger type="link" icon={<DeleteOutlined />} key="delete" />
                    </Popconfirm>
                </>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedIds,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedIds(selectedRowKeys as number[]);
        },
    };

    return (
        <div>
            <Table
                bordered
                dataSource={filteredTodos}
                columns={columns}
                rowSelection={rowSelection}
                rowKey="id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: filteredTodos.length,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50"],
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    },
                    position: ["bottomCenter"],
                }}
            />
        </div>
    );
}
