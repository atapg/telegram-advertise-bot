const { filterText } = require('../utils/filters')
const Advertisement = require('../models/advertisements')

const enterAdvScene = ctx => ctx.scene.enter('addAdvScene')

const returnToAdvScene = ctx => {
	ctx.deleteMessage()
	return ctx.scene.enter('addAdvScene')
}

const sendAdv = async ctx => {
	console.log({
		advText: ctx.session.text,
		advUsername: ctx.session.username,
	})

	// filterText(ctx.session.text)

	await ctx.deleteMessage()

	// TODO commend these area later
	// Check if user had sent a message in previous 12 hours
	// Each user should be able to send adv every 12 hours (2per day)
	const allAdvs = await Advertisement.find({
		telegram_id: ctx.update.callback_query.from.id,
	}).sort('-date')

	if (allAdvs.length > 0) {
		const lastAdv = allAdvs[allAdvs.length - 1]

		const time = new Date().getTime() - new Date(lastAdv.date).getTime()
		const minBefore = Math.floor(time / 60000)

		// TODO change time if u want
		// Last adv created less than 6 hours
		if (minBefore < 360) {
			return ctx.reply(
				'آخرین آگهی شما کمتر از 6 ساعت پیش ثبت شده است. جهت ارسال آگهی مجدد لطفا آخرین آگهی خود را حذف کنید.',
			)
		}
	}
	// These area

	// Check if adv text doesn't have any bad words here
	// Also check username
	// Then send it to the channel

	// Create adv in db
	const createAdv = await Advertisement.create({
		text: ctx.session.text,
		username: ctx.session.username,
		telegram_id: ctx.update.callback_query.from.id,
	})

	if (!createAdv) {
		return ctx.reply('مشکلی بوجود آمده است لطفا مجددا امتحان نمایید')
	}

	ctx.reply('آگهی با موفقیت ثبت شد')

	// Send adv to the channel
	console.log('send')
}

const showPrevAdvs = async ctx => {
	const sendMessage = await ctx.reply('در حال بارگزاری لطفا کمی صبر کنید')

	const allAdvs = await Advertisement.find({ telegram_id: ctx.message.from.id })

	// delete loading chat message
	await ctx.telegram.deleteMessage(ctx.message.chat.id, sendMessage.message_id)

	if (allAdvs.length > 0) {
		const length = allAdvs.length
		for (let i = 0; i < length; i++) {
			await ctx.telegram.sendMessage(ctx.message.chat.id, allAdvs[i].text)
		}
	} else {
		//no advz
		return ctx.reply('شما هیچ آگهی ثبت شده ای ندارید!')
	}
}

module.exports = {
	enterAdvScene,
	sendAdv,
	returnToAdvScene,
	showPrevAdvs,
}
