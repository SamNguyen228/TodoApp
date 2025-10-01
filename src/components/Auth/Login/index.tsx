"use client";
import { useState } from "react";
import { login } from "@/api/BackendApi/auth";
import { NotificationInstance } from "antd/es/notification/interface";
import { Form, Input, Button, Typography, Card } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import AuthHeader from "@/components/AuthHeader";
import { AxiosError } from "axios";

const { Title, Text } = Typography;

interface AuthProps {
  notify: NotificationInstance;
}

export default function LoginForm({ notify }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (values: { name: string; password: string }) => {
    try {
      setLoading(true);
      const data = await login(values.name, values.password);
      localStorage.setItem("token", data.token);

      notify.success({
        message: t("notify.success"),
        description: t("notify.login_success"),
      });

      window.location.href = "/todo";
    } catch (error) {
      const err = error as AxiosError;
      notify.error({
        message: t("notify.error"),
        description: err?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-pink-300 via-white to-blue-300 text-black">
      <AuthHeader />
      <Card className="w-full max-w-sm p-6 rounded-xl shadow-lg">
        <Title level={3} className="text-center">{t("title.login")}</Title>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label={t("form.name_label")}
            rules={[
              { required: true, message: t("validation.required",  {fieldName: t("form.name_label")}) },
              { min: 2, message: t("form.name_rule_min") },
              {
                pattern: /^[\p{L}]+$/u,
                message: t("form.name_rule_pattern"),
              },
            ]}
          >
            <Input placeholder={t("form.name_placeholder")} autoFocus />
          </Form.Item>

          <Form.Item
            name="password"
            label={t("form.password_label")}
            rules={[{ required: true, message: t("validation.required", {fieldName: t("form.password_label")}) }]}
          >
            <Input.Password placeholder={t("form.password_placeholder")} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {t("button.login")}
            </Button>
          </Form.Item>
        </Form>

        <Text className="block text-center text-gray-600">
          {t("form.form_option_login")}{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            {t("form.form_redirect_register")}
          </Link>
        </Text>
      </Card>
    </div>
  );
}
