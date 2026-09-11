import api from './api';

// 1. جلب جميع المشرفين
export const getAllAdmins = async () => {
  const res = await api.get('/admins');
  return res.data;
};

// 2. إنشاء مشرف جديد
export const createAdmin = async (adminData) => {
  const res = await api.post('/admins', adminData);
  return res.data;
};

// 3. تعديل بيانات مشرف
export const updateAdmin = async (id, updatedData) => {
  const res = await api.patch(`/admins/${id}`, updatedData);
  return res.data;
};

// 4. تغيير رتبة / صلاحية المشرف (هذه الدالة التي كانت مفقودة)
export const changeAdminRole = async (id, role) => {
  const res = await api.patch(`/admins/changeRole/${id}`, { role });
  return res.data;
};

// 5. تفعيل أو تعطيل حساب المشرف
export const toggleAdminActive = async (id) => {
  const res = await api.patch(`/admins/${id}/toggle-active`);
  return res.data;
};

// 6. حذف المشرف
export const deleteAdmin = async (id) => {
  const res = await api.delete(`/admins/${id}`);
  return res.data;
};