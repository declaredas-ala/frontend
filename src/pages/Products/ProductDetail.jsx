// src/components/ProductDetail.js
import React, { useState, useEffect } from "react";
import { Descriptions, Spin, Alert } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/produits/${id}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Spin tip="Chargement..." />;
  if (error)
    return <Alert message="Erreur" description={error} type="error" showIcon />;
  if (!product)
    return <Alert message="Produit non trouvé" type="warning" showIcon />;

  return (
    <Descriptions title="Détails du Produit" bordered>
      <Descriptions.Item label="Nom">{product.nom}</Descriptions.Item>
      <Descriptions.Item label="Type de Produit">
        {product.typedeproduit}
      </Descriptions.Item>
      <Descriptions.Item label="Unité">{product.unite}</Descriptions.Item>
      <Descriptions.Item label="Prix">{product.prix}</Descriptions.Item>
      <Descriptions.Item label="TVA">{product.tva}</Descriptions.Item>
    </Descriptions>
  );
};

export default ProductDetail;
