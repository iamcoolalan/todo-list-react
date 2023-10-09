import axios from 'axios';

const baseUrl = 'https://todo-list.alphacamp.io/api/';

const axiosInstance = axios.create({ baseURL: baseUrl })

axiosInstance.interceptors.request.use(
 (config) => {
  const token = localStorage.getItem('authToken')

  if(token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config
 },
  (error) => {
    console.error('[Request Failed]:', error)
  }
);

export const getTodos = async () => {
  try {
    const res = await axiosInstance.get(`${baseUrl}/todos`);

    return res.data
  } catch (error) {
    console.error('[Get Todos Failed]:', error)
  }
};

export const createTodo = async (payload) => {
  const { title, isDone } = payload

  try {
    const res = await axiosInstance.post(`${baseUrl}/todos`, {
      title,
      isDone,
    });

    return res.data
  } catch (error) {
    console.error('[Create Todo Failed]:', error);
  }
};

export const patchTodo = async (payload) => {
  const { id, title, isDone } = payload

  try {
    const res = await axiosInstance.patch(`${baseUrl}/todos/${id}`, {
      title,
      isDone,
    });

    return res.data
  } catch (error) {
    console.error('[Patch Todo Failed]:', error);
  }
};

export const deleteTodo = async (id) => {
    try {
      const res = axiosInstance.delete(`${baseUrl}/todos/${id}`);

      return res.data
    } catch (error) {
      console.error('[Delete Todo Failed]:', error);
    }
};