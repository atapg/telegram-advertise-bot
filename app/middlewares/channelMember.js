const { youMustSubscribe } = require('../utils/texts')

const isUserChannelMember = async (ctx, next) => {
	let id

	if (ctx.update.callback_query) {
		id = ctx.update.callback_query.from.id
	} else if (ctx.update.message) {
		id = ctx.update.message.from.id
	}

	return ctx.telegram
		.getChatMember(process.env.CHANNEL_ID, id)
		.then(async () => {
			// let user go
			return await next()
		})
		.catch(() => {
			// user not found
			return ctx.reply(youMustSubscribe)
			// return ctx.telegram.sendMessage(chat, youMustSubscribe, {
			// 	reply_markup: {
			// 		inline_keyboard: [
			// 			[
			// 				{
			// 					text: 'بله ✅',
			// 					url: `http://t.me/${process.env.CHANNEL_URLNOAT}`,
			// 				},
			// 			],
			// 		],
			// 	},
			// })
		})
}

module.exports = { isUserChannelMember }
