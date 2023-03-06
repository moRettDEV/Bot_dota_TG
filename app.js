const { Telegraf } = require('telegraf');
const { getPlayerStats, getMatchDetails } = require('./dota2stratz');

const config = require('./config.json');
const heroes = require('./heroes.json');
const bot = new Telegraf(config.telegramToken);

bot.start((ctx) => {
    ctx.reply('Привет! Я бот для просмотра статистики Dota 2. Введите /matches для получения информации о последних матчах игрока или /stats для получения общей статистики игрока.');
});

bot.command('stats', async (ctx) => {
    try {
        const stats = await getPlayerStats(ctx.message.text.match(/\d+/)[0]);
        ctx.replyWithMarkdown(
            `*Статистика игрока ${stats.identity.name}:*\n` +
            `Сыграно матчей: ${stats.matchCount}\n` +
            `Побед: ${stats.winCount}\n` +
            `Поражений: ${stats.matchCount - stats.winCount}\n` +
            `Убийств: ${stats.kills}\n` +
            `Смертей: ${stats.deaths}\n` +
            `Помощь: ${stats.assists}\n`
        );
    } catch (e) {
        console.log(e);
        ctx.reply('Произошла ошибка. Проверьте правильность введенного никнейма игрока и попробуйте еще раз.');
    }
});
bot.command('matches', async (ctx) => {
    try {
        const matches = await getMatchDetails(ctx.message.text.match(/\d+/)[0]);

        let lane = ["","Керри", "Мид", "Саппорт"]

        //конвертация времени в минуты
        // let start = matches;
        // let end = matches;
        // start = new Date(start * 1000);
        // end = new Date(end * 1000);

        const stats = await getPlayerStats(ctx.message.text.match(/\d+/)[0]);
        let message =
            `*Статистика игрока ${stats.identity.name}:*\n` +
            `Сыграно матчей: ${stats.matchCount}\n` +
            `Побед: ${stats.winCount}\n` +
            `Поражений: ${stats.matchCount - stats.winCount}\n` +
            `\n------------------------------------------------\n\n`

        for (let i = 0; i < matches.length; i++) {
            let statsMatch =
                `ID Матча: ${matches[i].players[0].matchId}\n` +
                // `Длительность матча: ${matches.players[0].}\n` +
                `Герой: ${heroes[matches[i].players[0].heroId].localized_name}\n` +
                `Уровень: ${matches[i].players[0].level}\n` +
                `Золото: ${matches[i].players[0].goldSpent}\n` +
                `Урон по героям: ${matches[i].players[0].heroDamage}\n` +
                `Урон по башням: ${matches[i].players[0].towerDamage}\n` +
                `Линия: ${lane[matches[i].players[0].lane]}\n` +
                `Результат: ${matches[i].players[0].isVictory ? "Победа" : "Поражение"}\n` +
                `Убийств: ${matches[i].players[0].numKills}\n` +
                `Смертей: ${matches[i].players[0].numDeaths}\n` +
                `Помощей: ${matches[i].players[0].numAssists}\n` +
                `\n------------------------------------------------\n\n`
            message += statsMatch
        }
        ctx.replyWithMarkdown(message);
    } catch (e) {
        console.log(e);
        ctx.reply('Произошла ошибка. Проверьте правильность введенного никнейма игрока и попробуйте еще раз.');
    }
});



bot.launch();
