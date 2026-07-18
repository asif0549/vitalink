import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vitallink_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: any) => {
    const res = await api.post('/api/auth/login', data);
    return res.data;
  },
  register: async (data: any) => {
    const res = await api.post('/api/auth/register', data);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/api/auth/me');
    return res.data;
  },
};

export const donorApi = {
  updateLocation: async (data: { latitude: number; longitude: number }) => {
    const res = await api.put('/api/donors/location', data);
    return res.data;
  },
  toggleAvailability: async (available: boolean) => {
    const res = await api.put(`/api/donors/availability?available=${available}`);
    return res.data;
  },
  getNearby: async (lat: number, lng: number, radius?: number) => {
    const url = radius 
      ? `/api/donors/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      : `/api/donors/nearby?lat=${lat}&lng=${lng}`;
    const res = await api.get(url);
    return res.data;
  },
  getAll: async () => {
    const res = await api.get('/api/donors/all');
    return res.data;
  },
};

export const hospitalApi = {
  getProfile: async () => {
    const res = await api.get('/api/hospitals/profile');
    return res.data;
  },
  updateInventory: async (bloodTypes: string[]) => {
    const res = await api.put('/api/hospitals/inventory', bloodTypes);
    return res.data;
  },
  rechargeWallet: async (amount: number) => {
    const res = await api.post('/api/hospitals/wallet/recharge', { amount });
    return res.data;
  },
  buySubscription: async (planName: string) => {
    const res = await api.post('/api/hospitals/subscription', { planName });
    return res.data;
  },
  getPayments: async () => {
    const res = await api.get('/api/hospitals/payments');
    return res.data;
  },
  getNearby: async (lat: number, lng: number) => {
    const res = await api.get(`/api/hospitals/nearby?lat=${lat}&lng=${lng}`);
    return res.data;
  },
  getAll: async () => {
    const res = await api.get('/api/hospitals/all');
    return res.data;
  },
};

export const requestApi = {
  createRequest: async (data: {
    patientName: string;
    bloodGroup: string;
    urgency: string;
    hospitalId: string;
    latitude: number;
    longitude: number;
  }) => {
    const res = await api.post('/api/requests', data);
    return res.data;
  },
  acceptRequest: async (id: string) => {
    const res = await api.put(`/api/requests/${id}/accept`);
    return res.data;
  },
  confirmRequest: async (id: string) => {
    const res = await api.put(`/api/requests/${id}/confirm`);
    return res.data;
  },
  cancelRequest: async (id: string) => {
    const res = await api.put(`/api/requests/${id}/cancel`);
    return res.data;
  },
  getActive: async () => {
    const res = await api.get('/api/requests/active');
    return res.data;
  },
  getHospitalRequests: async () => {
    const res = await api.get('/api/requests/hospital');
    return res.data;
  },
  getReceiverRequests: async () => {
    const res = await api.get('/api/requests/receiver');
    return res.data;
  },
  getAll: async () => {
    const res = await api.get('/api/requests/all');
    return res.data;
  },
};

export const rewardApi = {
  getRewards: async () => {
    const res = await api.get('/api/rewards');
    return res.data;
  },
  getLeaderboard: async () => {
    const res = await api.get('/api/rewards/leaderboard');
    return res.data;
  },
  getCertificate: async (level: string) => {
    const res = await api.get(`/api/rewards/certificate/${level}`);
    return res.data;
  },
};

export const notificationApi = {
  getNotifications: async () => {
    const res = await api.get('/api/notifications');
    return res.data;
  },
  markAsRead: async (id: string) => {
    const res = await api.put(`/api/notifications/${id}/read`);
    return res.data;
  },
};

export const adminApi = {
  getStats: async () => {
    const res = await api.get('/api/admin/stats');
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get('/api/admin/users');
    return res.data;
  },
  getDonorLocations: async () => {
    const res = await api.get('/api/admin/donors/locations');
    return res.data;
  },
};

export default api;
