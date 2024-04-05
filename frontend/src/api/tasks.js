import axios from 'axios';

const API_URL = '/api/tasks';

export const fetchTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching tasks:', error);
  }
};

export const createTask = async (newTask) => {
  try {
    const response = await axios.post(API_URL, newTask);
    return response.data;
  } catch (error) {
    throw new Error('Error creating task:', error);
  }
};

export const updateTask = async (id, updatedTask) => {
  try {
    await axios.put(`${API_URL}/${id}`, updatedTask);
  } catch (error) {
    throw new Error('Error updating task:', error);
  }
};

export const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Error deleting task:', error);
  }
};
