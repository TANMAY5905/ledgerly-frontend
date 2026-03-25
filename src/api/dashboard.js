import api from './axios';

export const getDashboardData = async (filterType = 'LAST_7_DAYS', startDate = null, endDate = null) => {
  const params = {
    totalfilter: filterType,
    dailyFilter: filterType,
    tagFilter: filterType,
    groupFilter: filterType,
  };
  
  if (filterType === 'CUSTOM') {
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
  }
  
  const response = await api.get('/dashboard', { params });
  return response.data;
};

export const getGroupDashboardData = async (groupId) => {
  const response = await api.get(`/dashboard/group/${groupId}`);
  return response.data;
};
