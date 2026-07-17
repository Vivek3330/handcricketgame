import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const gameAPI = {
  createGame: (difficulty) => api.post('/game/create', { difficulty }),
  playToss: (gameId, guess, number) => api.post('/game/toss', { gameId, guess, number }),
  chooseBatBowl: (gameId, choice) => api.post('/game/choose', { gameId, choice }),
  playBall: (gameId, number) => api.post('/game/play', { gameId, number }),
  finishGame: (gameId) => api.post('/game/finish', { gameId }),
  getGame: (gameId) => api.get(`/game/${gameId}`),
};

export const leaderboardAPI = {
  getTop: (limit = 10) => api.get(`/leaderboard/top?limit=${limit}`),
  getUserStats: () => api.get('/leaderboard/my-stats'),
  getUserLeaderboard: (userId) => api.get(`/leaderboard/user/${userId}`),
};

export default api;
