import axios from "axios";

const API_URL = " http://127.0.0.1:5000";

export const registerUser = (data) => {
  return axios.post(`${API_URL}/auth/register`, data);
};

export const loginUser = (data) => {
  return axios.post(`${API_URL}/auth/login`, data);
};

export const getApiCalls = (filters) => {
  return axios.get(`${API_URL}/api-calls/`, { params: filters });
};

export const retryApiCall = (id) => {
  return axios.post(`${API_URL}/api-calls/retry/${id}`);
};

export const logApiCall = (data) => axios.post("/api-calls/", data);
export const updateApiCall = (id, data) => axios.put(`/api-calls/${id}`, data);
export const deleteApiCall = (id) => axios.delete(`/api-calls/${id}`);

export const testExternalApi = (data) => axios.post("/api-calls/test", data);

export const getAllApiCalls = () => {
  return axios.get(`${API_URL}/api-calls/all`);
};

export const getUsers = () => {
  return axios.get(`${API_URL}/users/`);
};

export const activateUser = (id) => {
  return axios.put(`${API_URL}/users/${id}/activate`);
};
