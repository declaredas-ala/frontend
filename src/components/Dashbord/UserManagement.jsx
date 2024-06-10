import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  Input,
  Button,
  Select,
  Modal,
  message,
  Space,
  Switch,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserAddOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const UserComponent = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/users/");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch users");
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/users/",
        userData
      );
      message.success("User added successfully");
      fetchUsers();
      setModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to add user");
      setLoading(false);
    }
  };

  const updateUser = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/users/${userData.id}/`,
        userData
      );
      message.success("User updated successfully");
      fetchUsers();
      setModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to update user");
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (userData.id) {
      updateUser();
    } else {
      handleAdd();
    }
  };

  const editUser = (record) => {
    setUserData(record);
    setModalVisible(true);
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/users/${id}/`);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete user");
    }
  };

  const activateUser = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:5000/users/${id}/activate`);
      message.success("User activated successfully");
      fetchUsers();
    } catch (error) {
      console.error(error);
      message.error("Failed to activate user");
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setUserData({});
  };

  const handleChange = (key, value) => {
    setUserData({ ...userData, [key]: value });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    const filteredData = users.filter((user) =>
      Object.values(user).some((val) =>
        String(val).toLowerCase().includes(value.toLowerCase())
      )
    );
    setUsers(filteredData);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Admin",
      dataIndex: "is_admin",
      key: "is_admin",
      render: (text) => <Switch checked={text} disabled />,
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (text) => <Switch checked={text} disabled />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => editUser(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => deleteUser(record.id)}
          >
            Delete
          </Button>
          <Button
            type="link"
            icon={<CheckOutlined />}
            onClick={() => activateUser(record.id)}
            disabled={record.is_active}
          >
            Activate
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <Input
          placeholder="Search users"
          value={searchValue}
          onChange={handleSearch}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add User
        </Button>
      </div>
      <Modal
        title="Add/Edit User"
        visible={modalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form layout="vertical">
          <Form.Item label="First Name">
            <Input
              value={userData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Last Name">
            <Input
              value={userData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              value={userData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Phone">
            <Input
              value={userData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password
              value={userData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Admin">
            <Switch
              checked={userData.is_admin}
              onChange={(checked) => handleChange("is_admin", checked)}
            />
          </Form.Item>
          <Form.Item label="Active">
            <Switch
              checked={userData.is_active}
              onChange={(checked) => handleChange("is_active", checked)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table dataSource={users} columns={columns} rowKey="id" bordered />
    </div>
  );
};

export default UserComponent;
