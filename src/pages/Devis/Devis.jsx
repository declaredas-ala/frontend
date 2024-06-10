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
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router-dom";

const { Option } = Select;

const Devis = () => {
  const [devis, setDevis] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDevis();
    fetchClients();
    fetchProducts();
  }, []);

  const fetchDevis = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/devis");
      setDevis(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des devis:", error);
      message.error("Erreur lors de la récupération des devis");
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      message.error("Erreur lors de la récupération des clients");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/produits");
      setProducts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      message.error("Erreur lors de la récupération des produits");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevis = async (values) => {
    if (selectedProducts.length === 0) {
      message.error("Veuillez sélectionner des produits !");
      return;
    }

    const description = selectedProducts
      .map(
        (product) => `${product.nom} - ${product.prix} DT x ${product.quantity}`
      )
      .join(", ");

    const devisData = {
      ...values,
      description,
      montantTotal: totalAmount,
    };

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/devis", devisData);
      message.success("Devis ajouté avec succès");
      fetchDevis();
      setIsModalVisible(false);
      form.resetFields();
      setSelectedProducts([]);
      setTotalAmount(0);
    } catch (error) {
      console.error("Erreur lors de l'ajout du devis:", error);
      message.error("Erreur lors de l'ajout du devis");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDevis = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/devis/${id}`);
      message.success("Devis supprimé avec succès");
      fetchDevis();
    } catch (error) {
      console.error("Erreur lors de la suppression du devis:", error);
      message.error("Erreur lors de la suppression du devis");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (productIds) => {
    const newSelectedProducts = productIds.map((productId) => {
      const product = products.find((product) => product._id === productId);
      return { ...product, quantity: 1 };
    });
    setSelectedProducts(newSelectedProducts);
    calculateTotalAmount(newSelectedProducts);
  };

  const handleQuantityChange = (productId, quantity) => {
    const updatedProducts = selectedProducts.map((product) =>
      product._id === productId ? { ...product, quantity } : product
    );
    setSelectedProducts(updatedProducts);
    calculateTotalAmount(updatedProducts);
  };

  const calculateTotalAmount = (products) => {
    const total = products.reduce(
      (total, product) =>
        total +
        parseFloat(product.prix) *
          product.quantity *
          (1 + parseFloat(product.tva) / 100),
      0
    );
    setTotalAmount(total);
  };

  const handleConvertDevisToFacture = async (record) => {
    const devisId = record._id;
    const { numero, date, montantTotal, client, description } = record;
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/factures/",
        {
          numero,
          date,
          montantTotal,
          client: `${client.nom} ${client.prenom}`,
          description,
          devisId,
        },
        { withCredentials: true }
      );
      message.success("Devis converti en facture avec succès");

      // Mettre à jour l'état immédiatement
      setDevis((prevDevis) =>
        prevDevis.filter((devis) => devis._id !== devisId)
      );

      // Optionnellement, refetcher les données pour assurer la cohérence de l'état
      fetchDevis();
    } catch (error) {
      console.error("Erreur lors de la conversion du devis:", error);
      message.error("Erreur lors de la conversion du devis");
    } finally {
      setLoading(false);
    }
  };

  const filteredDevis = devis.filter((item) => {
    const clientName = item.client
      ? `${item.client.nom} ${item.client.prenom}`
      : "";
    return (
      item.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns = [
    {
      title: "ID Devis",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Numéro",
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
      render: (client) =>
        client ? `${client.nom} ${client.prenom}` : "Client non disponible",
    },
    {
      title: "Montant Total",
      dataIndex: "montantTotal",
      key: "montantTotal",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/devis/${record._id}`}>
            <Button type="primary" icon={<EyeOutlined />} />
          </Link>
          <Button
            type="primary"
            icon={<FileDoneOutlined />}
            onClick={() => handleConvertDevisToFacture(record)}
          >
            Convertir en Facture
          </Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce devis ?"
            onConfirm={() => handleDeleteDevis(record._id)}
            okText="Oui"
            cancelText="Non"
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
        <Input
          placeholder="Rechercher par numéro, description ou client"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          Ajouter Devis
        </Button>
        <Table
          columns={columns}
          dataSource={filteredDevis}
          rowKey="_id"
          loading={loading}
          bordered
          title={() => "Liste des Devis"}
          footer={() => `Total Devis : ${devis.length}`}
        />
      </Space>
      <Modal
        title="Ajouter Devis"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddDevis} layout="vertical">
          <Form.Item
            name="numero"
            label="Numéro"
            rules={[{ required: true, message: "Veuillez entrer le numéro" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Veuillez entrer la date" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="client"
            label="Client"
            rules={[
              { required: true, message: "Veuillez sélectionner un client" },
            ]}
          >
            <Select placeholder="Sélectionner un client">
              {clients.map((client) => (
                <Option key={client._id} value={client._id}>
                  {`${client.nom} ${client.prenom}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="produits"
            label="Produits"
            rules={[
              { required: true, message: "Veuillez sélectionner des produits" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Sélectionner des produits"
              onChange={handleAddProduct}
            >
              {products.map((product) => (
                <Option key={product._id} value={product._id}>
                  {product.nom}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {selectedProducts.map((product) => (
            <Form.Item
              key={product._id}
              label={`${product.nom} - ${product.prix} DT`}
            >
              <InputNumber
                min={1}
                value={product.quantity}
                onChange={(value) => handleQuantityChange(product._id, value)}
              />
            </Form.Item>
          ))}
          <Form.Item label="Montant Total">
            <InputNumber value={totalAmount} disabled />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Devis;
