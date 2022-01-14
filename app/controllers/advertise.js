const {
	Telegraf,
	Scenes: { WizardScene, Stage },
} = require('telegraf')

const { advSceneKeyboard } = require('../utils/keyboards')
const { addAdvText, exampleAdvText } = require('../utils/texts')

const adHandler = Telegraf.on('text', async ctx => {
	ctx.scene.state.name = ctx.message.text

	await ctx.telegram.sendMessage(ctx.chat.id, 'Are you sure??', {
		reply_markup: {
			inline_keyboard: [[{ text: 'Send the ad', callback_data: 'send' }]],
		},
	})
	return ctx.scene.leave()
})

// Create scene and bind handlers
const addAdvScene = new WizardScene('addAdvScene', adHandler)

addAdvScene.enter(async ctx => {
	await ctx.replyWithHTML(addAdvText, advSceneKeyboard.reply())
	ctx.replyWithHTML(exampleAdvText)
})

module.exports = { adHandler, addAdvScene }
