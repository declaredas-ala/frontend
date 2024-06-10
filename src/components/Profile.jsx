import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const profile = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5000/profile", {
        withCredentials: true,
      });
      form.setFieldsValue(response.data);
      dispatch(setCredentials(response.data));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        message.error("Session expired. Please log in again.");
      } else {
        message.error("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (values) => {
    setLoading(true);
    try {
      const csrfToken = Cookies.get("csrf_access_token");
      const response = await axios.put(
        "http://127.0.0.1:5000/profile",
        values,
        {
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        }
      );
      // Merge updated profile data with existing user info in the store
      const updatedProfile = {
        ...profile,
        ...response.data,
      };
      dispatch({ type: "SET_USER_INFO", payload: updatedProfile });
      message.success("Profile updated successfully");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        message.error("Session expired. Please log in again.");
      } else {
        message.error("Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return <Spin size="large" />;
  }

  return (
    <Card title="User Profile" style={{ maxWidth: 600, margin: "auto" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={updateProfile}
        initialValues={profile}
      >
        {/* Form fields */}
        <Form.Item name="first_name" label="First Name">
          <Input />
        </Form.Item>
        <Form.Item name="last_name" label="Last Name">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Update Profile
        </Button>
      </Form>
    </Card>
  );
};

export default Profile;
