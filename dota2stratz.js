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

/**
 * Получаем детали матчей для игрока с заданным ID
 *
 * @param playerId Индификатор пользователя steamID3
 *
 * @returns {Promise<Object>}
 *
 * @example playerId = 234997725
 */
async function getPlayerStats(playerId) {
    const response = await axiosInstance.get(`/player/${playerId}`);
    return response.data;
}

/**
 *
 * @param playerId Индификатор пользователя steamID3
 * @returns {Promise<Object>}
 * @example playerId = 234997725
 */
async function getMatchDetails(playerId) {
    const response = await axiosInstance.get(`/player/${playerId}/matches`);
    return response.data;
}

module.exports = {
    getMatchDetails,
    getPlayerStats,
};
