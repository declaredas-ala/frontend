import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Descriptions, Spin, message } from "antd";
import axios from "axios";

const DevisDetail = () => {
  const { id } = useParams();
  const [devis, setDevis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevis = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/devis/${id}`
        );
        setDevis(response.data);
      } catch (error) {
        console.error("Error fetching devis details:", error);
        message.error("Error fetching devis details");
      } finally {
        setLoading(false);
      }
    };

    fetchDevis();
  }, [id]);

  if (loading) {
    return <Spin />;
  }

  if (!devis) {
    return <p>Devis not found</p>;
  }

  return (
    <Descriptions title={`Devis Details - ${devis.numero}`} bordered>
      <Descriptions.Item label="Devis ID">{devis._id}</Descriptions.Item>
      <Descriptions.Item label="Number">{devis.numero}</Descriptions.Item>
      <Descriptions.Item label="Date">
        {new Date(devis.date).toLocaleDateString()}
      </Descriptions.Item>
      <Descriptions.Item label="Client">
        {devis.client ? `${devis.client.nom} ${devis.client.prenom}` : "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Total Amount">{`${devis.montantTotal} DT`}</Descriptions.Item>
      <Descriptions.Item label="Description">
        {devis.description}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default DevisDetail;
