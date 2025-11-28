import axios from 'axios';
import { getAuthHeader } from '../utils/auth';

const API_URL = '/api/quizzes';

export const uploadQuiz = async (formData) => {
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

