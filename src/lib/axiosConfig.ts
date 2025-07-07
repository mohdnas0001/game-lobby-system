import axios from 'axios';

export const baseUrl = 'https://game-lobby-backend-9d4k.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
          localStorage.removeItem('game_user');
          localStorage.removeItem('game_token');

        window.location.reload();
      }
      return Promise.reject(error);
    }
  );

export const post = async <T>(
  endpoint: string,
  data?: object,
  config?: object 
): Promise<T> => {
  const res = await axiosInstance.post(endpoint, data, config); 
  return res.data;
};

export const get = async <T>(endpoint: string, config?: object): Promise<T> => {
  const res = await axiosInstance.get(endpoint, config);
  return res.data;
};

export default axiosInstance;