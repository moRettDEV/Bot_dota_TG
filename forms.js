const heroes = require("./heroes.json");
module.exports = {

    /**
     * Формируем общую статистику пользователя
     *
     * @param {Object} stats Ответ от функции getPlayerStats
     * @param {string} stats.identity.name Имя пользователя
     * @param {number} stats.matchCount Кол-во матчей
     * @param {number} stats.winCount Кол-во побед
     *
     * @returns {string}
     */
    getGeneralStats(stats){
        let message = ''

        message += `*Статистика игрока ${stats.identity.name}:*\n`
        message += `Сыграно матчей: ${stats.matchCount}\n`
        message += `Побед: ${stats.winCount}\n`
        message += `Поражений: ${stats.matchCount - stats.winCount}\n\n`

        return message
    },

    /**
     * Формируем Body сообщения со статистикой матчей
     *
     * @param {Object} player Ответ от функции getMatchDetails
     * @param {Object} matches[i] Запрос endDateTime, startDateTime
     * @param {number} player.matchId Матч ID
     * @param {number} player.level Уровень героя
     * @param {number} player.heroId ID героя
     * @param {number} player.goldSpent Золото за игру
     * @param {number} player.heroDamage Урон по героям
     * @param {number} player.towerDamage Урон по башням
     * @param {number} player.lane Линия
     * @param {number} player.isVictory Результат
     * @param {number} player.numKills Убийств
     * @param {number} player.numDeaths Смертей
     * @param {number} player.numAssists Помощи
     *
     * @returns {string}
     */
    getMatchesBody(player, matches){
        let message = ''
        let lane = ['','Керри','Мид','Саппорт']

        message += `ID Матча: ${player.matchId}\n`
        message += `Длительность матча: ${this.getTimeMatch(matches)} мин\n`
        message += `Герой: ${heroes[player.heroId].localized_name}\n`
        message += `Уровень: ${player.level}\n`
        message += `Золото: ${player.goldSpent}\n`
        message += `Урон по героям: ${player.heroDamage}\n`
        message += `Урон по башням: ${player.towerDamage}\n`
        message += `Линия: ${lane[player.lane]}\n`
        message += `Результат: ${player.isVictory ? '🟢Победа' : '🔴Поражение'}\n`
        message += `Убийств: ${player.numKills}, Смертей: ${player.numDeaths}, Помощи: ${player.numAssists}\n`
        message += `\n------------------------------------\n\n`

        return message
    },

    /**
     *
     * Получаем длительность матча
     *
     * @param {Object} matches получаем всю информацию о матче
     * @param {number} matches.endDateTime Получаем время конца матча
     * @param {number} matches.startDateTime Получаем время начала матча
     *
     * @return {string}
     *
     */
    getTimeMatch(matches){

        let matchTime = matches.endDateTime - matches.startDateTime;

        let matchTimeMin = Math.floor(matchTime / 60);
        let matchTimeSec = matchTime % 60;
        matchTimeSec = matchTimeSec < 10 ? '0' + matchTimeSec : matchTimeSec;

        return `${matchTimeMin}:${matchTimeSec}`

    }

}