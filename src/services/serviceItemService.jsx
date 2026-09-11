import api from './api';

// جلب جميع الخدمات / البنود مع البحث والتصفح
export const getAllServiceItems = async (page = 1, limit = 10, search = '') => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append('search', search);

  const res = await api.get(`/serviceMangement/items?${params.toString()}`);
  return res.data;
};

// جلب خدمة محددة بالمعرف
export const getServiceItemById = async (id) => {
  const res = await api.get(`/serviceMangement/items/${id}`);
  return res.data;
};

// إنشاء خدمة جديدة
export const createServiceItem = async (data) => {
  const res = await api.post('/serviceMangement/items', {
    name: data.name.trim(),
    description: data.description ? data.description.trim() : '',
  });
  return res.data;
};

// تعديل خدمة حالية
export const updateServiceItem = async (id, data) => {
  const res = await api.put(`/serviceMangement/items/${id}`, {
    name: data.name.trim(),
    description: data.description ? data.description.trim() : '',
  });
  return res.data;
};

// حذف خدمة
export const deleteServiceItem = async (id) => {
  const res = await api.delete(`/serviceMangement/items/${id}`);
  return res.data;
};