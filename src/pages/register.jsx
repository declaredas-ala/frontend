import React, { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import { signUpAsync } from "../store/userApiSlice";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await dispatch(signUpAsync(values));
      toast.success("Inscription réussie! Veuillez vous connecter.");
      navigate("/login");
    } catch (error) {
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #f0f2f5 25%, #1890ff 100%)",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: 350,
          textAlign: "center",
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={2} style={{ color: "#1890ff", marginBottom: "20px" }}>
          Inscrivez-vous!
        </Title>
        <Form name="register" onFinish={onFinish} scrollToFirstError>
          <Form.Item
            name="first_name"
            rules={[
              {
                required: true,
                message: "Veuillez entrer votre prénom!",
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Prénom"
              prefix={<UserOutlined />}
              autoComplete="given-name"
              style={{ borderRadius: "5px" }}
            />
          </Form.Item>
          <Form.Item
            name="last_name"
            rules={[
              {
                required: true,
                message: "Veuillez entrer votre nom de famille!",
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Nom de famille"
              prefix={<UserOutlined />}
              autoComplete="family-name"
              style={{ borderRadius: "5px" }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "L'entrée n'est pas une adresse e-mail valide!",
              },
              {
                required: true,
                message: "Veuillez entrer votre adresse e-mail!",
              },
            ]}
          >
            <Input
              type="email"
              placeholder="Adresse e-mail"
              prefix={<MailOutlined />}
              autoComplete="email"
              style={{ borderRadius: "5px" }}
            />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: "Veuillez entrer votre numéro de téléphone!",
              },
            ]}
          >
            <Input
              type="tel"
              placeholder="Numéro de téléphone"
              prefix={<PhoneOutlined />}
              autoComplete="tel"
              style={{ borderRadius: "5px" }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Veuillez entrer votre mot de passe!",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder="Mot de passe"
              prefix={<LockOutlined />}
              autoComplete="new-password"
              style={{ borderRadius: "5px" }}
              active="0"
            />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[
              {
                required: true,
                message: "Veuillez entrer votre code!",
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Code"
              prefix={<UserOutlined />}
              autoComplete="code"
              style={{ borderRadius: "5px" }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                background: "#1890ff",
                borderColor: "#1890ff",
                borderRadius: "5px",
              }}
            >
              S'inscrire
            </Button>
          </Form.Item>
        </Form>
        <ToastContainer />
      </Card>
    </div>
  );
};

export default RegisterPage;
