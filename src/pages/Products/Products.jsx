import React, { useState, useEffect } from "react";
import {
  Table,
  Spin,
  Alert,
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/produits");
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    handleSearch(searchText);
  }, [products, searchText]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/produits/${id}`);
      message.success("Produit supprimé avec succès");
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      message.error("Erreur lors de la suppression du produit");
    }
  };

  const handleAddProduct = async (values) => {
    try {
      await axios.post("http://localhost:5000/api/produits", values);
      message.success("Produit ajouté avec succès");
      setVisible(false);
      form.resetFields();
      const response = await axios.get("http://localhost:5000/api/produits");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      console.error("Error adding product:", err);
      message.error("Erreur lors de l'ajout du produit");
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = products.filter(
      (product) =>
        product.nom.toLowerCase().includes(text.toLowerCase()) ||
        product.typedeproduit.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const columns = [
    { title: "Nom", dataIndex: "nom", key: "nom" },
    {
      title: "Type de Produit",
      dataIndex: "typedeproduit",
      key: "typedeproduit",
    },
    { title: "Unité", dataIndex: "unite", key: "unite" },
    { title: "Prix", dataIndex: "prix", key: "prix" },
    { title: "TVA", dataIndex: "tva", key: "tva" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/products/${record._id}`)}
          >
            Voir
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/products/edit/${record._id}`)}
          >
            Modifier
          </Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce produit?"
            onConfirm={() => handleDelete(record._id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="danger" icon={<DeleteOutlined />}>
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by Name or Type"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          style={{ marginBottom: 16 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          style={{ marginBottom: 16 }}
        >
          Ajouter Produit
        </Button>
        {error && (
          <Alert message="Error" description={error} type="error" showIcon />
        )}
        <Spin spinning={loading}>
          <Table dataSource={filteredProducts} columns={columns} rowKey="_id" />
        </Spin>
      </Space>
      <Modal
        title="Ajouter Produit"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleAddProduct} layout="vertical">
          <Form.Item
            name="nom"
            label="Nom"
            rules={[{ required: true, message: "Veuillez saisir le nom" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="typedeproduit"
            label="Type de Produit"
            rules={[{ required: true, message: "Veuillez saisir le type" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="unite"
            label="Unité"
            rules={[{ required: true, message: "Veuillez saisir l'unité" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="prix"
            label="Prix"
            rules={[{ required: true, message: "Veuillez saisir le prix" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tva"
            label="TVA"
            rules={[{ required: true, message: "Veuillez saisir la TVA" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Products;
