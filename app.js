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
} = require('./app/utils/constants')
const {
	enterAdvScene,
	sendAdv,
	returnToAdvScene,
	showPrevAdvs,
	deleteAdv,
} = require('./app/controllers/actions')
const { welcomeText } = require('./app/utils/texts')

const expressApp = express()

// Call mongodb
require('./app/config/mongodb.js')
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
const bot = new Telegraf(TOKEN)

const PORT = process.env.PORT || 3000
const URL = process.env.URL || 'https://your-heroku-app.herokuapp.com'

bot.telegram.setWebhook(`${URL}/bot${TOKEN}`)
expressApp.use(bot.webhookCallback(`/bot${TOKEN}`))

// Bot itself

// Middlewares
bot.use(session(), stage.middleware())

// Commands
bot.command('/start', async ctx => {
	await ctx.replyWithHTML(welcomeText, mainKeyboard.reply())
})

// listen for actions
bot.hears(addAdv, enterAdvScene)
bot.hears(manageAdvs, showPrevAdvs)

// Actions
bot.action('nope', returnToAdvScene)
bot.action('send', sendAdv)
bot.action('delete', deleteAdv)

// Launch the BOMB
expressApp.get('/', (req, res) => {
	res.send(`This is ${botName} API Server`)
})

expressApp.listen(PORT, () => {
	console.log(`BOT LAUNCHED on port ${PORT}`)
})
