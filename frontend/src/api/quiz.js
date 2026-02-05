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

export const getQuiz = async (quizId) => {
  const response = await axios.get(`${API_URL}/${quizId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const submitQuiz = async (quizId, answers) => {
  const response = await axios.post(
    `${API_URL}/${quizId}/submit`,
    { answers },
    {
      headers: getAuthHeader(),
    }
  );
  return response.data;
};

export const getQuizHistoryAndStats = async () => {
  const response = await axios.get(`${API_URL}/history/stats`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getResultById = async (resultId) => {
  const response = await axios.get(`${API_URL}/results/${resultId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
