require('dotenv').config()
const express = require('express')
const {
	Telegraf,
	session,
	Scenes: { Stage },
} = require('telegraf')

const { addAdvScene } = require('./app/controllers/advertise')
const { mainKeyboard } = require('./app/utils/keyboards')
const {
	addAdv,
	returnFromAdvsScene,
	manageAdvs,
	botName,
	lastAdv,
} = require('./app/utils/constants')
const {
	enterAdvScene,
	sendAdv,
	returnToAdvScene,
	showPrevAdvs,
	deleteAdv,
	showLastAdv,
	subscribeToChannel,
	presentAdv,
} = require('./app/controllers/actions')
const { welcomeText } = require('./app/utils/texts')

const expressApp = express()

// Call mongodb
require('./app/config/mongodb.js')
const { isUserChannelMember } = require('./app/middlewares/channelMember')
const { mustAddUsers } = require('./app/middlewares/mustAddUsers')
//-----------------------------------------END IMPORTS------------------------------------------

// Defining stage here...
const stage = new Stage([addAdvScene])
// Exiting the stage with button maybe return button
stage.hears(returnFromAdvsScene, ctx => {
	ctx.reply(`به منو بازگشتید ⬅️`, mainKeyboard.reply())
	return ctx.scene.leave()
})

// Bot itself
const TOKEN = process.env.TOKEN
const PORT = process.env.PORT || 3000
const URL = process.env.URL || 'https://telegram-advertise-bot.herokuapp.com'

const bot = new Telegraf(TOKEN)

// TODO comment on develop
bot.telegram.setWebhook(`${URL}/bot${TOKEN}`)
expressApp.use(bot.webhookCallback(`/bot${TOKEN}`))

// Bot itself

// Middlewares
bot.use(session(), stage.middleware())

// Commands
bot.command('/start', async ctx => {
	await ctx.replyWithHTML(welcomeText, mainKeyboard.reply())
})

// Channel Member Middleware
bot.use((ctx, next) => isUserChannelMember(ctx, next))
// Doesn't WORK
// bot.use((ctx, next) => mustAddUsers(ctx, next))

// listen for actions
bot.hears(addAdv, enterAdvScene)
bot.hears(manageAdvs, showPrevAdvs)
bot.hears(lastAdv, showLastAdv)

// Actions
bot.action('nope', returnToAdvScene)
bot.action('send', sendAdv)
bot.action(/delete_+/, deleteAdv)
bot.action(/present_+/, presentAdv)

// DANGER AREA
bot.on('sticker', ctx => ctx.reply('ارسال استیکر مجاز نیست ❌'))
// DANGER AREA

// Launch the BOMB
// TODO comment on develop
expressApp.get('/', (req, res) => {
	res.send(`This is ${botName} API Server`)
})

expressApp.listen(PORT, () => {
	console.log(`BOT LAUNCHED on port ${PORT}`)
})

// TODO enable on develop
// bot.launch().then(() => {
// 	console.log('BOT LAUNCHED')
// })
