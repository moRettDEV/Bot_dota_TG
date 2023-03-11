const { Telegraf } = require('telegraf');
const dotaStrats = require('./dota2stratz');
const forms = require('./forms')

const config = require('./config.json');
const bot = new Telegraf(config.telegramToken);

bot.start((ctx) => {
    ctx.reply(`Привет ${ctx.from.first_name}! Я бот для просмотра статистики Dota 2. Введите /matches для получения информации о последних матчах игрока или /stats для получения общей статистики игрока.`);
});
let users = {
    session: {
        stats: {},
        matches: {}
    },
    userId: {}
}

bot.command('stats', (ctx) => {
    ctx.reply('Введите ID игрока:');
    users.session.stats[ctx.message.chat.id] = true;
});
bot.command('matches', (ctx) => {
    ctx.reply('Введите ID игрока:');
    users.session.matches[ctx.message.chat.id] = true;
    console.log(users.session.matches)
});

//stats
bot.on('text', async (ctx) => {

    if (users.session.stats[ctx.message.chat.id]) {

        try {

            const stats = await dotaStrats.getPlayerStats(ctx.message.text);

            ctx.replyWithMarkdown(forms.getGeneralStats(stats));

        } catch (e) {

            console.log(e);
            ctx.reply('Произошла ошибка. Проверьте правильность введенного никнейма игрока и попробуйте еще раз.');

        }

        users.session.stats[ctx.message.chat.id] = false;

    }

});

//matches
bot.on('text', async (ctx) => {

    if (users.session.matches[ctx.message.chat.id]) {

        console.log('Проверка сессии матчей')
        console.log(users.session.matches[ctx.message.chat.id])

        try {

            const matches = await dotaStrats.getMatchDetails(ctx.message.text);
            const stats = await dotaStrats.getPlayerStats(ctx.message.text);

            let message = forms.getGeneralStats(stats)

            console.log("Перед циклом")

            for (let i = 0; i < matches.length; i++) {

                console.log("В цикле циклом")

                message += forms.getMatchesBody(matches[i].players[0], matches[i])

            }

            console.log("после цикла")

            // Отправляем сообщение с информацией о матчах
            await ctx.replyWithMarkdown(message);

        } catch (e) {

            console.error(error);
            await ctx.reply('Произошла ошибка. Проверьте правильность введенного ID игрока и попробуйте еще раз.');

        }

        users.session.matches[ctx.message.chat.id] = false

    }

});

bot.launch()
