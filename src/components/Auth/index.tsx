"use client";
import { useState } from "react";
import { login, register } from "@/api/BackendApi/auth";
import { NotificationInstance } from "antd/es/notification/interface";
import { Form, Input, Button, Typography, Card } from "antd";
import { FaLock } from "react-icons/fa6";

const { Title, Text } = Typography;

interface AuthProps {
  notify: NotificationInstance;
}

export default function AuthForm({ notify }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { name: string; password: string }) => {
    try {
      setLoading(true);
      if (isLogin) {
        const data = await login(values.name, values.password);

        notify.success({
          message: "Success",
          description: "Login successful!",
        });
        localStorage.setItem("token", data.token);
        console.log(data.token);

        window.location.href = "/todo";
      } else {
        await register(values.name, values.password);
        notify.success({
          message: "Success",
          description: "Registration successful!",
        });
        setIsLogin(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        notify.error({
          message: isLogin ? "Login failed" : "Registration failed",
          description: err.message,
        });
      } else {
        notify.error({
          message: "Error",
          description: "Something went wrong",
        });
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-pink-300 via-white to-blue-300 text-black">
      <Card className="w-full max-w-sm p-6 rounded-xl shadow-lg">
        <Title level={3} className="flex justify-center items-center">
          {isLogin ? "Login" : "Register"}
        </Title>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Username"
            rules={[
              { required: true, message: "Username cannot be empty" },
              { min: 2, message: "Username must be at least 2 characters" },
              {
                pattern: /^[A-Za-z]+$/,
                message: "Username can only contain letters (no numbers or symbols)",
              },
            ]}
          >
            <Input placeholder="Enter your username" autoFocus />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Password cannot be empty" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="rounded-lg"
            >
              {isLogin ? "Login" : "Register"}
            </Button>
          </Form.Item>
        </Form>

        <Text className="block text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-500 font-semibold cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register now" : "Login"}
          </span>
        </Text>
      </Card>
    </div>
  );
}
