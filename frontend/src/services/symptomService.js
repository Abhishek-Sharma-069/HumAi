import api from './api';

const analyzeSymptoms = async (symptoms, imageData = null) => {
  try {
    const requestData = { symptoms };
    if (imageData) {
      requestData.image = imageData;
    }
    const response = await api.post('/health/analyze-symptoms', requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to analyze symptoms' };
  }
};

export const symptomService = {
  analyzeSymptoms,
};