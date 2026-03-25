import api from './axios';

export const getUserGroups = async () => {
  const response = await api.get('/groups/user');
  return response.data;
};

export const createGroup = async (name) => {
  // The backend uses @RequestParam for createGroup
  const response = await api.post('/groups/create', null, {
    params: {
      name
    }
  });
  return response.data;
};

export const addMemberToGroup = async (groupId, userId) => {
  const response = await api.post('/groups/add-member', null, {
    params: {
      groupId,
      userId
    }
  });
  return response.data;
};

export const getGroupMembers = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/members`);
  return response.data;
};

export const getGroupMemberCount = async(groupId) => {
  const response = await api.get(`/groups/${groupId}/member-count`);
  return response.data;
}

export const getGroupTransactions = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/transactions`);
  return response.data;
}

export const getGroupMyShare = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/my-share`);
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await api.get('/users/search', {
    params: { query }
  });
  return response.data;
};

export const removeMember = async (groupId, userId) => {
  const response = await api.delete('/groups/remove-member', {
    params: { groupId, userId }
  });
  return response.data;
};

export const deleteGroup = async (groupId) => {
  const response = await api.delete('/groups/delete', {
    params: { groupId }
  });
  return response.data;
};

export const leaveGroup = async (groupId) => {
  const response = await api.delete('/groups/leave', {
    params: { groupId }
  });
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get('/groups/notifications');
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/groups/notifications/${id}/read`);
  return response.data;
};
