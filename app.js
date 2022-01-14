require('dotenv').config()

const {
	Telegraf,
	session,
	Scenes: { WizardScene, Stage },
	Markup,
} = require('telegraf')

const { addAdvScene } = require('./app/controllers/advertise')
const { mainKeyboard } = require('./app/utils/keyboards')
const { addAdv, returnFromAdvsScene } = require('./app/utils/constants')
const {
	enterAdvScene,
	sendAdv,
	returnToAdvScene,
} = require('./app/controllers/actions')

// ----------------------------------------END IMPORTS------------------------------------------

// Defining stage here...
const stage = new Stage([addAdvScene])

// Exiting the stage with button maybe return button
stage.hears(returnFromAdvsScene, ctx => {
	ctx.reply(`به منو بازگشتید`, mainKeyboard.reply())
	return ctx.scene.leave()
})

// Bot itself
const bot = new Telegraf(process.env.TOKEN)
// Bot itself

// Middlewares
bot.use(session(), stage.middleware())

// Commands
bot.command('/start', ctx => {
	ctx.reply('Welcome to our bot', mainKeyboard.reply())
})

bot.hears(addAdv, enterAdvScene)

// Actions
bot.action('nope', returnToAdvScene)
bot.action('send', sendAdv)

// Launch the BOMB
bot.launch()
