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
					{
						text: 'عضو شدم ✅',
						callback_data: `checkMember`,
					},
				],
			],
		},
	})
}

const isUserChannelMember = async (ctx, next, hasReturn) => {
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
					await next() //1052972017
					if (hasReturn) {
						return ctx.telegram.sendMessage(
							chat,
							'شما با موفقیت در کانال ها عضو شده اید حالا میتوانید از خدمات ما استفاده کنید ✅',
						)
					}
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
