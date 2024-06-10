import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Form,
  Input,
  Modal,
  message,
  Space,
  Select,
  Row,
  Col,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const Factures = () => {
  const [factures, setFactures] = useState([]);
  const [filteredFactures, setFilteredFactures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentFacture, setCurrentFacture] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFactures();
  }, []);

  useEffect(() => {
    handleSearch(searchText);
  }, [factures, searchText]);

  const fetchFactures = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/factures");
      setFactures(response.data);
      setFilteredFactures(response.data);
    } catch (error) {
      console.error("Error fetching factures:", error);
      message.error("Error fetching factures");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFacture = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/factures/${id}`);
      message.success("Facture deleted successfully");
      fetchFactures();
    } catch (error) {
      console.error("Error deleting facture:", error);
      message.error("Error deleting facture");
    } finally {
      setLoading(false);
    }
  };

  const handleEditFacture = (facture) => {
    setCurrentFacture(facture);
    setIsModalVisible(true);
    form.setFieldsValue(facture);
  };

  const handleUpdateFacture = async (values) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/factures/${currentFacture._id}`,
        values
      );
      message.success("Facture updated successfully");
      fetchFactures();
      setIsModalVisible(false);
      form.resetFields();
      setCurrentFacture(null);
    } catch (error) {
      console.error("Error updating facture:", error);
      message.error("Error updating facture");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = factures.filter(
      (facture) =>
        facture.numero.toLowerCase().includes(text.toLowerCase()) ||
        facture.client.toLowerCase().includes(text.toLowerCase()) ||
        facture.status.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFactures(filtered);
  };

  const columns = [
    {
      title: "Facture ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Number",
      dataIndex: "numero",
      key: "numero",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
    },
    {
      title: "Total Amount",
      dataIndex: "montantTotal",
      key: "montantTotal",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/factures/${record._id}`)}
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditFacture(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this facture?"
            onConfirm={() => handleDeleteFacture(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Col>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search by Number, Client or Status"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={filteredFactures}
          rowKey="_id"
          loading={loading}
          bordered
          title={() => "Factures List"}
          footer={() => `Total Factures: ${filteredFactures.length}`}
        />
      </Space>
      <Modal
        title="Edit Facture"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdateFacture} layout="vertical">
          <Form.Item
            name="numero"
            label="Number"
            rules={[{ required: true, message: "Please enter the number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please enter the date" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="client"
            label="Client"
            rules={[{ required: true, message: "Please enter the client" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="montantTotal"
            label="Total Amount"
            rules={[
              { required: true, message: "Please enter the total amount" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status" }]}
          >
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="paid">Paid</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Facture
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Factures;
