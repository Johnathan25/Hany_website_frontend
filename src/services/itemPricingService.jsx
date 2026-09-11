import api from './api';

// ==========================================
// Items APIs
// ==========================================
export const getAllItems = async () => {
  const res = await api.get('/serviceMangement/items');
  return res.data;
};

export const getItemById = async (id) => {
  const res = await api.get(`/serviceMangement/items/${id}`);
  return res.data;
};

export const createItem = async (itemData) => {
  const res = await api.post('/serviceMangement/items', itemData);
  return res.data;
};

export const createManyItems = async (itemsArray) => {
  const res = await api.post('/serviceMangement/items/bulk', { items: itemsArray });
  return res.data;
};

export const updateItem = async (id, updatedData) => {
  const res = await api.put(`/serviceMangement/items/${id}`, updatedData);
  return res.data;
};

export const deleteItem = async (id) => {
  const res = await api.delete(`/serviceMangement/items/${id}`);
  return res.data;
};

// ==========================================
// Pricing APIs
// ==========================================
export const getAllPricing = async () => {
  const res = await api.get('/serviceMangement/pricing');
  return res.data;
};

export const getPricingByName = async (name) => {
  const res = await api.get(`/serviceMangement/getPricingByName/${encodeURIComponent(name)}`);
  return res.data;
};

export const createPricing = async (pricingData) => {
  const res = await api.post('/serviceMangement/pricing', pricingData);
  return res.data;
};

export const updatePricing = async (id, updatedPricing) => {
  const res = await api.put(`/serviceMangement/pricing/${id}`, updatedPricing);
  return res.data;
};