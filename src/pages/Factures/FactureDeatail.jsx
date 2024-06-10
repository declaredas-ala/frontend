import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, message, Button, Space, Input, Modal } from "antd";
import {
  DownloadOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  MailOutlined,
} from "@ant-design/icons";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const FactureDetail = () => {
  const { id } = useParams();
  const [facture, setFacture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchFacture = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/factures/${id}`,
          { withCredentials: true }
        );
        setFacture(response.data);
      } catch (error) {
        console.error("Error fetching facture details:", error);
        message.error("Error fetching facture details");
      } finally {
        setLoading(false);
      }
    };

    fetchFacture();
  }, [id]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 20;

    // Header
    doc.setFontSize(18);
    doc.text("Détails de la Facture", margin, 30);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, 40);
    doc.line(margin, 45, doc.internal.pageSize.width - margin, 45);

    // Facture details
    doc.autoTable({
      startY: 50,
      head: [["Champ", "Valeur"]],
      body: [
        ["Numéro", facture.numero],
        ["Date", facture.date],
        ["Montant Total", `${facture.montantTotal} €`],
        ["Client", facture.client.nom],
        ["Client Email", facture.client.email],
        ["Description", facture.description],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    return doc;
  };

  const handleDownloadPDF = () => {
    const doc = generatePDF();
    doc.save(`Facture_${facture._id}.pdf`);
  };

  const handleSendEmail = async () => {
    if (!facture) {
      message.error("Facture details not available to send");
      return;
    }

    const doc = generatePDF();
    const pdf = doc.output("datauristring");
    const base64PDF = pdf.split(",")[1];

    try {
      await axios.post(
        `http://localhost:5000/api/factures/send-email`,
        {
          email: recipientEmail,
          subject: `Facture ${facture._id}`,
          pdf: base64PDF,
        },
        { withCredentials: true }
      );
      message.success("Email sent successfully");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error sending email:", error);
      message.error("Error sending email");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (loading) {
    return <Spin />;
  }

  if (!facture) {
    return <p>Facture not found</p>;
  }

  return (
    <Card
      title={
        <span>
          <FileTextOutlined /> Facture {facture._id}
        </span>
      }
      extra={
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadPDF}
          >
            Télécharger PDF
          </Button>
          <Button type="default" icon={<MailOutlined />} onClick={showModal}>
            Envoyer par Email
          </Button>
        </Space>
      }
    >
      <p>
        <strong>
          <CalendarOutlined /> Numéro :
        </strong>{" "}
        {facture.numero}
      </p>
      <p>
        <strong>
          <CalendarOutlined /> Date :
        </strong>{" "}
        {facture.date}
      </p>
      <p>
        <strong>
          <DollarOutlined /> Montant Total :
        </strong>{" "}
        {facture.montantTotal} €
      </p>
      <p>
        <strong>
          <UserOutlined /> Client :
        </strong>{" "}
        {facture.client.nom}
      </p>
      <p>
        <strong>
          <UserOutlined /> Client Email :
        </strong>{" "}
        {facture.client.email}
      </p>
      <p>
        <strong>
          <FileTextOutlined /> Description :
        </strong>{" "}
        {facture.description}
      </p>
      <Modal
        title="Envoyer la facture par Email"
        visible={isModalVisible}
        onOk={handleSendEmail}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Entrez l'adresse email du destinataire"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
        />
      </Modal>
    </Card>
  );
};

export default FactureDetail;
