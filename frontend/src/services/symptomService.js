import api from './api';

const analyzeSymptoms = async (symptoms) => {
  try {
    const response = await api.post('/health/analyze-symptoms', { symptoms });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to analyze symptoms' };
  }
};

export const symptomService = {
  analyzeSymptoms,
};