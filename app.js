require('dotenv').config()

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
} = require('./app/utils/constants')
const {
	enterAdvScene,
	sendAdv,
	returnToAdvScene,
	showPrevAdvs,
} = require('./app/controllers/actions')
const { welcomeText } = require('./app/utils/texts')

// Call mongodb
require('./app/config/mongodb.js')
//----------------------------------------END IMPORTS------------------------------------------

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
bot.command('/start', async ctx => {
	await ctx.replyWithHTML(welcomeText, mainKeyboard.reply())
})

// listen for actions
bot.hears(addAdv, enterAdvScene)
bot.hears(manageAdvs, showPrevAdvs)

// Actions
bot.action('nope', returnToAdvScene)
bot.action('send', sendAdv)

// Launch the BOMB
bot.launch().then(() => {
	console.log('BOT LAUNCHED')
})
