import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, message, Button, Form, Input, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${id}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        message.error("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdateUser = async (values) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, values);
      message.success("User updated successfully");
      setIsModalVisible(false);
      setUser({ ...user, ...values });
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin />;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <Card title={`User ${user.name}`}>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={() => setIsModalVisible(true)}
      >
        Edit User
      </Button>
      <Modal
        title="Edit User"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleUpdateUser}
          layout="vertical"
          initialValues={user}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter the user's name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter the user's email!" },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserDetail;
