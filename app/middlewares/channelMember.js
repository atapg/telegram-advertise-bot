const { youMustSubscribe } = require('../utils/texts')

const isUserChannelMember = async (ctx, next) => {
	let id
	let chat

	if (ctx.update.callback_query) {
		id = ctx.update.callback_query.from.id
	} else if (ctx.update.message) {
		id = ctx.update.message.from.id
	}

	if (ctx.update.callback_query) {
		chat = ctx.update.callback_query.message.chat.id
	} else if (ctx.update.message) {
		chat = ctx.update.message.chat.id
	}

	if (chat) {
		return ctx.telegram
			.getChatMember(process.env.CHANNEL_ID, id)
			.then(async () => {
				// let user go
				return await next()
			})
			.catch(() => {
				// user not found
				return ctx.telegram.sendMessage(chat, youMustSubscribe, {
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: 'عضویت در کانال ◀️',
									url: `http://t.me/${process.env.CHANNEL_URLNOAT}`,
								},
							],
						],
					},
				})
			})
	} else {
		return await next()
	}
}

module.exports = { isUserChannelMember }
