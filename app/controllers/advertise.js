const {
	Telegraf,
	Scenes: { WizardScene },
} = require('telegraf')

const { advSceneKeyboard } = require('../utils/keyboards')
const {
	addAdvText,
	exampleAdvText,
	addUsernameText,
} = require('../utils/texts')

const advTextHandler = Telegraf.on('text', async ctx => {
	ctx.scene.state.text = ctx.message.text

	await ctx.replyWithHTML(addUsernameText)

	return ctx.wizard.next()
})

const usernameHandler = Telegraf.on('text', async ctx => {
	ctx.session.text = ctx.scene.state.text
	ctx.session.username = ctx.message.text

	await ctx.telegram.sendMessage(
		ctx.chat.id,
		'آیا برای درج این آگهی مطمئن هستید؟',
		{
			reply_markup: {
				inline_keyboard: [
					[
						{ text: 'بله ✅', callback_data: 'send' },
						{ text: 'خیر ❌', callback_data: 'nope' },
					],
				],
			},
		},
	)

	return ctx.scene.leave()
})

// ----------------------------------------------------------------------------------

// Create scene and bind handlers
const addAdvScene = new WizardScene(
	'addAdvScene',
	advTextHandler,
	usernameHandler,
)

addAdvScene.enter(async ctx => {
	await ctx.replyWithHTML(addAdvText, advSceneKeyboard.reply())
	ctx.replyWithHTML(exampleAdvText)
})

module.exports = { addAdvScene }
