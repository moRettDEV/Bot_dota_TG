const { Telegraf } = require('telegraf');
const dotaStrats = require('./dota2stratz');
const forms = require('./forms')

const config = require('./config.json');
const bot = new Telegraf(config.telegramToken);

bot.start((ctx) => {
    ctx.reply(forms.getStarted(ctx));
    console.log(forms.getStarted(ctx))
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

});

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

    } else if (users.session.matches[ctx.message.chat.id]) {

        try {

            const matches = await dotaStrats.getMatchDetails(ctx.message.text);
            const stats = await dotaStrats.getPlayerStats(ctx.message.text);

            let message = forms.getGeneralStats(stats)

            for (let i = 0; i < 4; i++) {

                message += forms.getMatchesBody(matches[i].players[0], matches[i])

            }

            await ctx.replyWithMarkdown(message);

        } catch (e) {

            console.error(e);
            await ctx.reply('Произошла ошибка. Проверьте правильность введенного ID игрока и попробуйте еще раз.');

        }

        users.session.matches[ctx.message.chat.id] = false

    }

});

bot.launch()
