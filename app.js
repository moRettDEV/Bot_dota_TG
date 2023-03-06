const { Telegraf } = require('telegraf');
const { getPlayerMatches } = require('./dota2stratz');

const config = require('./config.json');
const bot = new Telegraf(config.telegramToken);

bot.start((ctx) => {
    ctx.reply('Привет! Введи никнейм игрока для просмотра статистики Dota 2.');
});

bot.on('text', async (ctx) => {
    try {
        const stats = await getPlayerMatches(ctx.message.text);
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

bot.launch();
