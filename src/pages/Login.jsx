import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import { signInAsync } from "../store/userApiSlice";
import { setCredentials } from "../store/authSlice";
import "react-toastify/dist/ReactToastify.css";
// import illustration from "../assets/illustration.svg"; // Import your custom illustration

const { Title, Text } = Typography;

const SignInForm = () => {
  const userinfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error(
        "Veuillez entrer votre adresse e-mail et votre mot de passe!"
      );
      return;
    }

    try {
      const signInAction = await dispatch(signInAsync({ email, password }));
      if (signInAction.meta.requestStatus === "fulfilled") {
        dispatch(setCredentials(signInAction.payload));
        toast.success("Connexion réussie");
        navigate("/");
      } else {
        console.error("Error signing in:", signInAction.error.message);
        toast.error(
          "Échec de la connexion. Veuillez vérifier vos informations."
        );
      }
    } catch (error) {
      console.error("Error signing in:", error.message);
      toast.error("Erreur de serveur. Veuillez réessayer plus tard.");
    }
  };

  useEffect(() => {
    if (userinfo) {
      navigate("/");
    }
  }, [navigate, userinfo]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #92FFC0, #002661)",
        padding: "20px",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <img
          // src={illustration}
          alt="illustration"
          style={{
            position: "absolute",
            top: "-50%",
            left: "-30%",
            width: "80%",
            height: "auto",
            opacity: "0.3",
            transform: "rotate(-45deg)",
          }}
        />
      </div>
      <Card
        style={{
          position: "relative",
          width: 400,
          padding: "30px 40px",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <Title
          level={2}
          style={{
            color: "#000",
            marginBottom: "20px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          Welcome Back! 🌟
        </Title>
        <Form onFinish={handleSubmit} style={{ marginTop: "20px" }}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Veuillez entrer votre adresse e-mail!",
              },
            ]}
          >
            <Input
              type="email"
              placeholder="Adresse e-mail 📧"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              autoComplete="email"
              style={{
                borderRadius: "10px",
                height: "45px",
                fontSize: "16px",
                marginBottom: "15px",
              }}
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
          >
            <Input.Password
              placeholder="Mot de passe 🔒"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              prefix={<LockOutlined style={{ color: "#1890ff" }} />}
              autoComplete="on"
              style={{
                borderRadius: "10px",
                height: "45px",
                fontSize: "16px",
                marginBottom: "15px",
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                background: "#1890ff",
                borderColor: "#1890ff",
                borderRadius: "10px",
                height: "45px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Let's Go! 🚀
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ display: "block", marginTop: "20px", color: "#000" }}>
          Don't have an account?{" "}
          <Button
            type="link"
            onClick={() => navigate("/register")}
            style={{ color: "#000", fontWeight: "bold" }}
          >
            Sign Up Now! 📝
          </Button>
        </Text>
        <ToastContainer />
      </Card>
    </div>
  );
};

export default SignInForm;
