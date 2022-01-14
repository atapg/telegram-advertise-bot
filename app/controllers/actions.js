const enterAdvScene = ctx => ctx.scene.enter('addAdvScene')

const returnToAdvScene = ctx => {
	ctx.deleteMessage()
	return ctx.scene.enter('addAdvScene')
}

const sendAdv = ctx => {
	ctx.deleteMessage()
	// Check if adv text doesn't have any bac words here
	ctx.reply('آگهی با موفقیت ارسال شد')
	console.log('send')
}

module.exports = {
	enterAdvScene,
	sendAdv,
	returnToAdvScene,
}
