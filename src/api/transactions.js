import api from './axios';

export const logTransaction = async (transactionData) => {
  const response = await api.post('/transactions/add', null, { 
    params: transactionData,
    paramsSerializer: {
      indexes: null // Serializes tagIds: [1,2] -> ?tagIds=1&tagIds=2
    }
  });
  return response.data;
};

export const getUserTransactions = async (params = {}) => {
  const response = await api.get(`/transactions/user`, { 
    params,
    paramsSerializer: {
      indexes: null 
    }
  });
  return response.data;
};

export const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/transactions/${id}`, null, {
    params: transactionData,
    paramsSerializer: {
      indexes: null
    }
  });
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

export const downloadBulkTemplate = async () => {
  const response = await api.get('/transactions/bulk/template', {
    responseType: 'blob'
  });
  return response.data;
};

export const bulkUploadTransactions = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/transactions/bulk-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
