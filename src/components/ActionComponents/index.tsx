import React from "react";
import { Button, Popconfirm, NotificationInstance } from "antd";
import { useTodoStore } from "@/stores/todoStore";

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
      message: "Thành công",
      description: "Đã đánh dấu hoàn thành công việc",
    });
  };

  const handleDelete = () => {
    deleteMany(selectedIds);
    notify.info({
      message: "Đã xoá",
      description: "Công việc đã được xoá khỏi danh sách",
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
      >
        Hoàn thành
      </Button>

      <Popconfirm
        title="Xác nhận xoá"
        description={`Bạn có chắc muốn xoá ${selectedIds.length} công việc đã chọn không?`}
        okText="Xoá"
        cancelText="Hủy"
        onConfirm={handleDelete}
      >
        <Button danger className="hover:scale-110" disabled={selectedIds.length === 0}>
          Xoá
        </Button>
      </Popconfirm>
    </div>
  );
}
