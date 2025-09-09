import React from "react";
import { Button, Popconfirm } from "antd";
import type { NotificationInstance } from "antd/es/notification/interface";
import { useTodoStore } from "@/stores/todoStore";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";

interface ActionProps {
  notify: NotificationInstance;
}

export default function Action({ notify }: ActionProps) {
  const { deleteMany, completeMany, selectedIds, todos } = useTodoStore();

  const allSelectedCompleted = selectedIds.every(
    (id) => todos.find((t) => t.id === id)?.completed
  );

  const handleComplete = () => {
    completeMany(selectedIds);
    notify.success({
      message: "Success",
      description: "Selected tasks have been marked as completed",
    });
  };

  const handleDelete = () => {
    deleteMany(selectedIds);
    notify.success({
      message: "Deleted",
      description: "Selected tasks have been removed from the list",
    });
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button
        color="green"
        variant="solid"
        className="hover:scale-110"
        disabled={selectedIds.length === 0 || allSelectedCompleted}
        onClick={handleComplete}
        icon={<CheckOutlined />}
      >
        Complete
      </Button>

      <Popconfirm
        title="Confirm deletion"
        description={`Are you sure you want to delete ${selectedIds.length} selected task(s)?`}
        okText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
      >
        <Button
          color="red"
          variant="solid"
          className="hover:scale-110"
          disabled={selectedIds.length === 0}
          icon={<DeleteOutlined />}
        >
          Delete
        </Button>
      </Popconfirm>
    </div>
  );
}
