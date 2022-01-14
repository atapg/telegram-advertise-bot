const enterAdvScene = ctx => ctx.scene.enter('addAdvScene')

const returnToAdvScene = ctx => {
	ctx.deleteMessage()
	return ctx.scene.enter('addAdvScene')
}

const sendAdv = ctx => {
	console.log({
		advText: ctx.session.text,
		advUsername: ctx.session.username,
	})
	ctx.deleteMessage()
	// Check if adv text doesn't have any bac words here
	// THen send it to the channel
	ctx.reply('آگهی با موفقیت ارسال شد')
	console.log('send')
}

module.exports = {
	enterAdvScene,
	sendAdv,
	returnToAdvScene,
}
