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
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ApiOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const API_CALL_TYPES = ["GET", "POST", "PUT", "DELETE"];
const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Success", value: 200 },
  { label: "Error", value: 500 },
];

const APICallComponent = () => {
  const [apiCalls, setAPICalls] = useState([]);
  const [filteredApiCalls, setFilteredApiCalls] = useState([]);
  const [userData, setUserData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  useEffect(() => {
    fetchAPICalls();
  }, []);

  useEffect(() => {
    handleFilterAndSearch();
  }, [apiCalls, searchValue, statusFilter, methodFilter]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "API Endpoint",
      dataIndex: "api_endpoint",
      key: "api_endpoint",
    },
    {
      title: "Request Method",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Request Body",
      dataIndex: "request_body",
      key: "request_body",
    },
    {
      title: "Status",
      dataIndex: "response_code",
      key: "response_code",
      render: (text) => {
        if (text === 200) {
          return <span style={{ color: "green" }}>{text}</span>;
        } else if (text === 500) {
          return <span style={{ color: "red" }}>{text}</span>;
        } else {
          return text;
        }
      },
    },
    {
      title: "Response",
      dataIndex: "response",
      key: "response",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => editAPICall(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => deleteAPICall(record.id)}
          >
            Delete
          </Button>
          <Button
            type="link"
            icon={<ApiOutlined />}
            onClick={() => makeAPICall(record)}
          >
            Make API Call
          </Button>
        </Space>
      ),
    },
  ];

  const fetchAPICalls = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api-calls/");
      setAPICalls(response.data);
      setFilteredApiCalls(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api-calls/",
        userData
      );
      message.success(response.data.message);
      fetchAPICalls();
      setModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to add API call");
      setLoading(false);
    }
  };

  const updateAPICall = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api-calls/${userData.id}`,
        userData
      );
      message.success(response.data.message);
      fetchAPICalls();
      setModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to update API call");
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (userData.id) {
      updateAPICall();
    } else {
      handleAdd();
    }
  };

  const editAPICall = (record) => {
    setUserData(record);
    setModalVisible(true);
  };

  const deleteAPICall = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/api-calls/${id}`
      );
      message.success(response.data.message);
      fetchAPICalls();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete API call");
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setUserData({});
  };

  const handleChange = (key, value) => {
    setUserData({ ...userData, [key]: value });
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleMethodFilterChange = (value) => {
    setMethodFilter(value);
  };

  const handleFilterAndSearch = () => {
    let filteredData = [...apiCalls]; // Make a copy of apiCalls

    if (searchValue) {
      filteredData = filteredData.filter((call) =>
        Object.values(call).some((val) =>
          String(val).toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
    if (statusFilter !== "") {
      // Check if statusFilter is not an empty string
      filteredData = filteredData.filter(
        (call) => call.response_code === parseInt(statusFilter)
      );
    }
    if (methodFilter) {
      filteredData = filteredData.filter((call) => call.type === methodFilter);
    }
    setFilteredApiCalls(filteredData);
  };

  const makeAPICall = async (record) => {
    const { id, api_endpoint, type, request_body } = record;
    try {
      let response;
      switch (type) {
        case "GET":
          response = await axios.get(api_endpoint);
          break;
        case "POST":
          response = await axios.post(api_endpoint, request_body);
          break;
        case "PUT":
          response = await axios.put(api_endpoint, request_body, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          break;
        case "DELETE":
          response = await axios.delete(api_endpoint);
          break;
        default:
          throw new Error("Invalid request method");
      }

      const updatedRecord = {
        response_code: response.status,
        response: JSON.stringify(response.data),
      };

      await axios.put(`http://127.0.0.1:5000/api-calls/${id}`, updatedRecord, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      message.success("API call executed and updated successfully");
      fetchAPICalls();
    } catch (error) {
      console.error(error);
      const updatedRecord = {
        response_code: error.response ? error.response.status : 500,
        response: JSON.stringify({ error: error.message }),
      };
      await axios.put(`http://127.0.0.1:5000/api-calls/${id}`, updatedRecord, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      message.error("Failed to make API call");
      fetchAPICalls();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <Input
          placeholder="Search API calls"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ flex: 1 }}
        />
        <Select
          style={{ width: 200 }}
          placeholder="Filter by Status"
          onChange={handleStatusFilterChange}
          value={statusFilter}
        >
          {STATUS_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <Select
          style={{ width: 200 }}
          placeholder="Filter by Method"
          onChange={handleMethodFilterChange}
          value={methodFilter}
        >
          {API_CALL_TYPES.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add API Call
        </Button>
      </div>
      <Modal
        title="Add/Edit API Call"
        visible={modalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form layout="vertical">
          <Form.Item label="User ID">
            <Input
              value={userData.user_id}
              onChange={(e) => handleChange("user_id", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="API Endpoint">
            <Input
              value={userData.api_endpoint}
              onChange={(e) => handleChange("api_endpoint", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Request Method">
            <Select
              value={userData.type}
              onChange={(value) => handleChange("type", value)}
            >
              {API_CALL_TYPES.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Request Body">
            <Input.TextArea
              value={userData.request_body}
              rows={4}
              onChange={(e) => handleChange("request_body", e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={filteredApiCalls}
        columns={columns}
        rowKey="id"
        bordered
      />
    </div>
  );
};

export default APICallComponent;
