import React from 'react'
import { List, Checkbox, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useTodoStore } from '@/stores/todoStore';

export default function ListTodo() {
    const {
        filter,
        todos,
        selectedIds,
        toggleSelect,
        setEditing
    } = useTodoStore();

    const filteredTodos = todos.filter((todo) => {
        if (filter === "completed") return todo.completed;
        if (filter === "active") return !todo.completed;
        return true;
    });

    return (
        <div>
            <List
                bordered
                dataSource={filteredTodos}
                renderItem={(todo) => (
                    <List.Item
                        actions={[
                            <Button
                                type="link"
                                onClick={() => setEditing(todo)}
                                key="edit"
                                icon={<EditOutlined />}
                                disabled={todo.completed}
                            />,
                        ]}
                    >
                        <Checkbox
                            checked={selectedIds.includes(todo.id)}
                            onChange={(e) => toggleSelect(todo.id, e.target.checked)}
                        >
                            <span
                                className={`${todo.completed ? "line-through text-gray-400" : ""}`}
                            >
                                {todo.text}
                            </span>
                        </Checkbox>
                    </List.Item>
                )}
            />
        </div>
    )
}
