"use client";
import { useState } from "react";
import { register } from "@/api/BackendApi/auth";
import { NotificationInstance } from "antd/es/notification/interface";
import { Form, Input, Button, Typography, Card } from "antd";
import { useTranslation } from "react-i18next";
import AuthHeader from "@/components/AuthHeader";
import Link from "next/link";

const { Title, Text } = Typography;

interface AuthProps {
  notify: NotificationInstance;
}

export default function RegisterForm({ notify }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (values: {
    name: string;
    password: string;
    confirmPassword: string;
    email: string;
    fullName: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      notify.error({
        message: t("notify.error"),
        description: t("notify.error_confirm_password"),
      });
      return;
    }

    try {
      setLoading(true);
      await register(
        values.name,
        values.password,
        values.email,
        values.fullName
      );
      notify.success({
        message: t("notify.success"),
        description: t("notify.register_success"),
      });
      window.location.href = "/login";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      notify.error({
        message: t("notify.error_register_failed"),
        description: err?.message || t("notify.error"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-pink-300 via-white to-blue-300 text-black space-y-6">
      <AuthHeader />
      <Card className="w-full max-w-sm p-6 rounded-xl shadow-lg">
        <Title level={3} className="text-center">
          {t("title.register")}
        </Title>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="fullName"
            label={t("form.full_name_label")}
            rules={[
              {
                required: true,
                message: t("validation.required", { fieldName: t("form.full_name_label") })
              },
            ]}
          >
            <Input placeholder={t("form.full_name_placeholder")} />
          </Form.Item>

          <Form.Item
            name="email"
            label={t("form.email_label")}
            rules={[
              {
                required: true,
                message: t("validation.required", { fieldName: "Email" }),
              },
              { type: "email", message: t("form.email_rule_type") },
            ]}
          >
            <Input placeholder={t("form.email_placeholder")} />
          </Form.Item>

          <Form.Item
            name="name"
            label={t("form.name_label")}
            rules={[
              {
                required: true,
                message: t("validation.required", { fieldName: t("form.name_label") }),
              },
              { min: 2, message: t("form.name_rule_min") },
              {
                pattern: /^[A-Za-z]+$/,
                message: t("form.name_rule_pattern"),
              },
            ]}
          >
            <Input placeholder={t("form.name_placeholder")} />
          </Form.Item>

          <Form.Item
            name="password"
            label={t("form.password_label")}
            rules={[
              {
                required: true,
                message: t("validation.required", { fieldName: t("form.password_label") }),
              },
              { min: 6, message: t("form.password_rule_min") },
            ]}
          >
            <Input.Password placeholder={t("form.password_placeholder")} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={t("form.confirm_password_label")}
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: t("validation.required", {
                  fieldName: t("form.confirm_password_label"),
                }),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("notify.error_confirm_password"))
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder={t("form.confirm_password_placeholder")}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {t("button.register")}
            </Button>
          </Form.Item>
        </Form>

        <Text className="block text-center text-gray-600">
          {t("form.form_option_register")}{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            {t("button.login")}
          </Link>
        </Text>
      </Card>
    </div>
  );
}
