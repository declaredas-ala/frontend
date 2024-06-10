import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, message } from "antd";
import axios from "axios";

const ClientDetail = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/clients/${id}`
        );
        setClient(response.data);
      } catch (error) {
        console.error("Error fetching client details:", error);
        message.error("Error fetching client details");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (loading) {
    return <Spin />;
  }

  if (!client) {
    return <p>Client not found</p>;
  }

  return (
    <Card title={`${client.nom} ${client.prenom}`}>
      <p>
        <strong>Numéro de téléphone:</strong> {client.numtele}
      </p>
      <p>
        <strong>CIN:</strong> {client.cin}
      </p>
    </Card>
  );
};

export default ClientDetail;
