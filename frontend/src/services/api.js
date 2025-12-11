import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const courtAPI = {
    getAll: () => api.get('/courts'),
    getById: (id) => api.get(`/courts/${id}`)
};

export const equipmentAPI = {
    getAll: () => api.get('/equipment'),
    getById: (id) => api.get(`/equipment/${id}`)
};

export const coachAPI = {
    getAll: () => api.get('/coaches'),
    getById: (id) => api.get(`/coaches/${id}`)
};

export const bookingAPI = {
    create: (data) => api.post('/bookings', data),
    getAll: (params) => api.get('/bookings', { params }),
    getById: (id) => api.get(`/bookings/${id}`),
    cancel: (id) => api.patch(`/bookings/${id}/cancel`),
    getAvailableSlots: (params) => api.get('/bookings/available-slots', { params })
};

export const pricingRuleAPI = {
    getAll: () => api.get('/pricing-rules')
};

export default api;