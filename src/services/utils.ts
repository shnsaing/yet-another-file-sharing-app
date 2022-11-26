import axios, { CreateAxiosDefaults } from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';

export const buildAxiosInstance = (config: CreateAxiosDefaults) => {
  const axiosClient = axios.create(config);

  axiosClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  }, Promise.reject);

  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log(error);
      const token = sessionStorage.getItem('token');
      const refreshToken = sessionStorage.getItem('refresh_token');
      if (token && refreshToken) {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp && decoded.exp <= new Date().getTime()) {
          // Use refresh token
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosClient;
};
