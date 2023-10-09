import axios from 'axios';

const baseUrl = 'http://localhost:3001';

export const getTodos = async () => {
  try {
    const res = await axios.get(`${baseUrl}/todos`);

    return res.data
  } catch (error) {
    console.error('[Get Todos Failed]:', error)
  }
};

export const createTodos = async (payload) => {
  const { title, isDone } = payload
  
  try {
    const res = await axios.post(`${baseUrl}/todos`, {
      title,
      isDone
    });

    return res.data
  } catch (error) {
    console.error('[Create Todos Failed]:', error);
  }
};

export const patchTodos = () => {

};

export const deleteTodos = () => {

};