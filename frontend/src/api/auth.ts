import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000' });

export const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const getMe = async (token: string) => {
  const { data } = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  return data;
};
