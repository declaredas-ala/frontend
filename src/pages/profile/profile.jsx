import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, message, Spin } from "antd";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            withCredentials: true,
          }
        );
        setProfile(response.data);
        form.setFieldsValue(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        message.error("Erreur lors de la récupération du profil");
      }
    };

    fetchProfile();
  }, [form]);

  const handleUpdateProfile = async (values) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        values,
        { withCredentials: true }
      );
      setProfile(response.data);
      message.success("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      message.error("Erreur lors de la mise à jour du profil");
    }
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div>
      <h2>Gérer le Profil</h2>
      <Form form={form} onFinish={handleUpdateProfile} layout="vertical">
        <Form.Item name="fullName" label="Nom Complet">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Mot de Passe">
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Mettre à jour le Profil
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
