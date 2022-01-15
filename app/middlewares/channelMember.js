const { youMustSubscribe } = require('../utils/texts')

const returnError = (ctx, chat) => {
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
}

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
		return await ctx.telegram
			.getChatMember(process.env.CHANNEL_ID, id)
			.then(async user => {
				// types: [member, left, creator, administrator]
				if (user.status === 'left') {
					return returnError(ctx, chat)
				} else {
					// let user go
					return await next() //1052972017
				}
			})
			.catch(() => {
				// user not found
				return returnError(ctx, chat)
			})
	} else {
		return await next()
	}
}

module.exports = { isUserChannelMember }
