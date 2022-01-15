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
	// console.log({ text: ctx.message.text })
	// TODO Check text is valid and has no bad words
	if (false) {
	} else {
		await ctx.replyWithHTML(addUsernameText)

		return ctx.wizard.next()
	}
})

const usernameHandler = Telegraf.on('text', async ctx => {
	ctx.session.text = ctx.scene.state.text
	ctx.session.username = ctx.message.text
	// console.log({ id: ctx.message.text })
	if (
		ctx.session.username.startsWith('@') &&
		ctx.session.username.length <= 5
	) {
		ctx.reply('نام کاربری وارد شده مجاز نمیباشد ❌')
	} else {
		const channelAdv = `
			🔸 ${ctx.session.text}
			
			
			📞 ${ctx.session.username}
			-------------------------
			🔰 ${process.env.CHANNEL_URL}
			-------------------------
			
			🔴 آیا جهت درج این آگهی مطمئن هستید؟ 🔴
		`
		await ctx.telegram.sendMessage(ctx.chat.id, channelAdv, {
			reply_markup: {
				inline_keyboard: [
					[
						{ text: 'بله ✅', callback_data: 'send' },
						{ text: 'خیر ❌', callback_data: 'nope' },
					],
				],
			},
		})

		return ctx.scene.leave()
	}
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
