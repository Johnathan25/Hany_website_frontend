import api from './api';

// جلب جميع سجلات الأسعار
export const getAllPricing = async () => {
  const res = await api.get('/serviceMangement/pricing');
  return res.data;
};

// جلب سعر خدمة محددة بالاسم (inspection | consultation | maintenance)
export const getPricingByName = async (serviceName) => {
  const res = await api.get(`/serviceMangement/getPricingByName/${serviceName}`);
  return res.data;
};

// إنشاء سجل تسعير جديد
export const createPricing = async (pricingData) => {
  const res = await api.post('/serviceMangement/pricing', {
    inspectionPrice: Number(pricingData.inspectionPrice),
    consultationPrice: Number(pricingData.consultationPrice),
    maintenanceDeposit: Number(pricingData.maintenanceDeposit),
  });
  return res.data;
};

// تعديل سجل تسعير حالي
export const updatePricing = async (id, pricingData) => {
  const res = await api.put(`/serviceMangement/pricing/${id}`, {
    inspectionPrice: Number(pricingData.inspectionPrice),
    consultationPrice: Number(pricingData.consultationPrice),
    maintenanceDeposit: Number(pricingData.maintenanceDeposit),
  });
  return res.data;
};