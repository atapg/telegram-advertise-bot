const { youMustSubscribe } = require('../utils/texts')

const mustAddUsers = async (ctx, next) => {
	const id = ctx.update.message.from.id
	console.log(id)
	ctx.telegram
		.getChatMember(process.env.CHANNEL_ID, id)
		.then(res => {
			console.log(res)
			// let user go
			next()
		})
		.catch(() => {
			// user not found
			console.log('NO USER')
			return ctx.reply(youMustSubscribe)
		})
}

module.exports = { mustAddUsers }
