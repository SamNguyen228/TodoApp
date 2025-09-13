import React from "react";
import { Modal, Input, DatePicker, Select } from "antd";
import { useTodoStore } from "@/stores/todoStore";
import dayjs, { Dayjs } from "dayjs";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { Priority } from "@/stores/todoStore";

interface EditModalProps {
  notify: NotificationInstance;
}

export default function EditModal({ notify }: EditModalProps) {
  const { editTodo, editing, setEditing } = useTodoStore();

  const handleOk = () => {
    if (editing && editing.text.trim()) {
      if (editing.deadline && dayjs(editing.deadline).isBefore(dayjs())) {
        notify.error({
          message: "Error",
          description: "Deadline is already overdue. Cannot update!",
        });
        return;
      }

      editTodo(editing.id, editing.text, editing.deadline, editing.priority);
      setEditing(null);
      notify.success({
        message: "Success",
        description: "Update task successful!",
      });
    } else {
      notify.warning({
        message: "Warning",
        description: "Please fill your content!",
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
      {/* Task Name */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Task Name</label>
        <Input
          value={editing?.text}
          onChange={(e) =>
            setEditing(
              editing ? { ...editing, text: e.target.value } : null
            )
          }
          onPressEnter={handleOk}
        />
      </div>

      {/* Deadline */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Deadline</label>
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

      {/* Priority */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Priority</label>
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
