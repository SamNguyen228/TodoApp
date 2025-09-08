import React from 'react'
import { Modal, Input } from 'antd';
import { useTodoStore } from '@/stores/todoStore';

export default function EditModal() {
    const {
        editTodo,
        editing,
        setEditing,
    } = useTodoStore();

    return (
        <Modal
            open={!!editing}
            title="Sửa công việc"
            okText="Lưu"
            cancelText="Hủy"
            onCancel={() => setEditing(null)}
            onOk={() => {
                if (editing) {
                    editTodo(editing.id, editing.text);
                    setEditing(null);
                }
            }}
        >
            <Input
                value={editing?.text}
                onChange={(e) =>
                    setEditing(
                        editing ? { ...editing, text: e.target.value } : null
                    )
                }
                onPressEnter={() => {
                    if (editing) {
                        editTodo(editing.id, editing.text);
                        setEditing(null);
                    }
                }}
            />
        </Modal>
    )
}
