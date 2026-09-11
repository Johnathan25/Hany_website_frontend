import api from './api';

// جلب جميع طلبات الخدمات للمدير مع Pagination
export const getAllServiceRequests = async (page = 1, limit = 10) => {
  const res = await api.get(`/serviceRequests/admin/all?page=${page}&limit=${limit}`);
  return res.data;
};

// حذف طلب خدمة (إذا لم يكن مدفوعاً)
export const deleteServiceRequest = async (id) => {
  const res = await api.delete(`/serviceRequests/${id}`);
  return res.data;
};