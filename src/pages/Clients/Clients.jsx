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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients :", error);
      message.error("Erreur lors de la récupération des clients");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (values) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/clients", values);
      message.success("Client ajouté avec succès");
      fetchClients();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Erreur lors de l'ajout du client :", error);
      message.error("Erreur lors de l'ajout du client");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = async (values) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/clients/${currentClient._id}`,
        values
      );
      message.success("Client mis à jour avec succès");
      fetchClients();
      setIsModalVisible(false);
      form.resetFields();
      setIsEditing(false);
      setCurrentClient(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client :", error);
      message.error("Erreur lors de la mise à jour du client");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      message.success("Client supprimé avec succès");
      fetchClients();
    } catch (error) {
      console.error("Erreur lors de la suppression du client :", error);
      message.error("Erreur lors de la suppression du client");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentClient(null);
    setIsModalVisible(true);
  };

  const openEditModal = (client) => {
    setIsEditing(true);
    setCurrentClient(client);
    form.setFieldsValue(client);
    setIsModalVisible(true);
  };

  const openDetailModal = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/clients/${id}`
      );
      setCurrentClient(response.data);
      setIsDetailModalVisible(true);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du client :",
        error
      );
      message.error("Erreur lors de la récupération des détails du client");
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      (client.nom &&
        client.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.prenom &&
        client.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.numtele && client.numtele.toString().includes(searchTerm)) || // conversion to string
      (client.cin && client.cin.toString().includes(searchTerm)) || // conversion to string
      (client.email &&
        client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.adresse &&
        client.adresse.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
    },
    {
      title: "Prénom",
      dataIndex: "prenom",
      key: "prenom",
    },
    {
      title: "Numéro de téléphone",
      dataIndex: "numtele",
      key: "numtele",
    },
    {
      title: "CIN",
      dataIndex: "cin",
      key: "cin",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Adresse",
      dataIndex: "adresse",
      key: "adresse",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => openDetailModal(record._id)}
          >
            Voir
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Modifier
          </Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce client ?"
            onConfirm={() => handleDeleteClient(record._id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSubmit = (values) => {
    if (isEditing) {
      handleEditClient(values);
    } else {
      handleAddClient(values);
    }
  };

  return (
    <div>
      <h2>Clients</h2>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Rechercher par nom, prénom, téléphone, CIN, email ou adresse"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={openAddModal}
      >
        Ajouter un client
      </Button>
      <Table
        dataSource={filteredClients}
        columns={columns}
        rowKey="_id"
        loading={loading}
        bordered
      />
      <Modal
        title={isEditing ? "Modifier le client" : "Ajouter un client"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="nom"
            label="Nom"
            rules={[
              { required: true, message: "Veuillez entrer le nom du client!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="prenom"
            label="Prénom"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le prénom du client!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="numtele"
            label="Numéro de téléphone"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le numéro de téléphone du client!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cin"
            label="CIN"
            rules={[
              { required: true, message: "Veuillez entrer le CIN du client!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Veuillez entrer l'email du client!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="adresse" label="Adresse">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? "Modifier" : "Ajouter"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Détails du client"
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Fermer
          </Button>,
        ]}
      >
        {currentClient && (
          <div>
            <p>
              <strong>Nom:</strong> {currentClient.nom}
            </p>
            <p>
              <strong>Prénom:</strong> {currentClient.prenom}
            </p>
            <p>
              <strong>Numéro de téléphone:</strong> {currentClient.numtele}
            </p>
            <p>
              <strong>CIN:</strong> {currentClient.cin}
            </p>
            <p>
              <strong>Email:</strong> {currentClient.email}
            </p>
            <p>
              <strong>Adresse:</strong> {currentClient.adresse}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Clients;
