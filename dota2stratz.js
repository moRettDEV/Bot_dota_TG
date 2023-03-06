const axios = require('axios');

const config = require('./config.json');
const API_KEY = config.dota2StratzKey; // заменить на свой ключ API

const axiosInstance = axios.create({
    baseURL: 'https://api.stratz.com/api/v1',
});

axiosInstance.interceptors.request.use(
    (config) => {
        config.headers['Authorization'] = `Bearer ${API_KEY}`;
        return config;
    },
    (error) => Promise.reject(error)
);

async function getPlayerMatches(playerId) {
    const response = await axiosInstance.get(`/player/${playerId}`);
    return response.data;
}

async function getMatchDetails(matchId) {
    const response = await axiosInstance.get(`/match/${matchId}`);
    return response.data;
}

module.exports = {
    getPlayerMatches,
    getMatchDetails,
};
