const { filterText } = require('../utils/filters')
const Advertisement = require('../models/advertisements')

const enterAdvScene = ctx => ctx.scene.enter('addAdvScene')

const returnToAdvScene = ctx => {
	ctx.deleteMessage()
	return ctx.scene.enter('addAdvScene')
}

const sendAdv = async ctx => {
	await ctx.deleteMessage()

	// TODO uncomment these area later
	// Check if user had sent a message in previous 12 hours
	// Each user should be able to send adv every 12 hours (2per day)
	// const allAdvs = await Advertisement.find({
	// telegram_id: ctx.update.callback_query.from.id,
	// }).sort('-date')
	//
	// if (allAdvs.length > 0) {
	// 	const lastAdv = allAdvs[allAdvs.length - 1]
	//
	// 	const time = new Date().getTime() - new Date(lastAdv.date).getTime()
	// 	const minBefore = Math.floor(time / 60000)
	//
	// 	// TODO change time if u want
	// 	// Last adv created less than 6 hours
	// 	if (minBefore < 360) {
	// 		return ctx.reply(
	// 			'آخرین آگهی شما کمتر از 6 ساعت پیش ثبت شده است. جهت ارسال آگهی مجدد لطفا آخرین آگهی خود را حذف کنید.',
	// 		)
	// 	}
	// }
	// These area

	// Check if adv text doesn't have any bad words here
	// Also check username
	// Then send it to the channel

	// Create adv in db
	const createdAdv = new Advertisement({
		text: ctx.session.text,
		username: ctx.session.username,
		telegram_id: ctx.update.callback_query.from.id,
	})

	const channelAdv = `
		🔸 ${createdAdv.text}
		
		
		📞 ${createdAdv.username}
		-------------------------
		🔰 ${process.env.CHANNEL_URL}
	`

	// Send message to channel
	const result = await ctx.telegram.sendMessage(
		process.env.CHANNEL_ID,
		channelAdv,
	)

	createdAdv.message_id = result.message_id
	await createdAdv.save(err => {
		if (err) {
			return ctx.reply('مشکلی بوجود آمده است لطفا مجددا امتحان نمایید')
		}
	})

	ctx.reply('آگهی با موفقیت ثبت شد ✅')
}

const showPrevAdvs = async ctx => {
	const sendMessage = await ctx.reply('در حال بارگزاری لطفا کمی صبر کنید')

	const allAdvs = await Advertisement.find({ telegram_id: ctx.message.from.id })

	// delete loading chat message
	await ctx.telegram.deleteMessage(ctx.message.chat.id, sendMessage.message_id)

	if (allAdvs.length > 0) {
		const length = allAdvs.length
		for (let i = 0; i < length; i++) {
			const advText = `
				🗒 نوشته آگهی:  ${allAdvs[i].text}
				👤 تماس:${allAdvs[i].username}
				📅 تاریخ:  ${new Date(allAdvs[i].date).toLocaleDateString('fa-IR')}
			`
			await ctx.telegram.sendMessage(ctx.message.chat.id, advText, {
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: 'حذف آگهی ❌',
								callback_data: `delete_${allAdvs[i]._id.toString()}`,
							},
						],
					],
				},
			})
		}
	} else {
		//no advz
		return ctx.reply('شما هیچ آگهی ثبت شده ای ندارید!')
	}
}

const deleteAdv = async ctx => {
	const id = ctx.match.input.substring(7)
	const loadingMessage = await ctx.reply('❌ در حال حذف کردن...')

	// delete from db
	const deletableAdv = await Advertisement.findByIdAndDelete(id)

	if (!deletableAdv) {
		return ctx.reply('مشکلی بوجود آمده است ❌')
	}

	// delete adv from chat
	await ctx.telegram.deleteMessage(
		ctx.update.callback_query.message.chat.id,
		ctx.update.callback_query.message.message_id,
	)

	// delete adv from channel
	await ctx.telegram.deleteMessage(
		process.env.CHANNEL_ID,
		deletableAdv.message_id,
	)

	// delete loading message
	await ctx.telegram.deleteMessage(
		ctx.update.callback_query.message.chat.id,
		loadingMessage.message_id,
	)

	return ctx.reply('آگهی با موفقیت حذف شد ✅')
}

const showLastAdv = async ctx => {
	const id = ctx.update.message.from.id

	const lastAdv = await Advertisement.findOne(
		{
			telegram_id: id,
		},
		{},
		{ sort: '-date' },
	)

	if (!lastAdv) {
		return ctx.reply(
			'مشکلی بوجود آمده است و یا هیچ آگهی به نام شما وجود ندارد ❌',
		)
	}

	const advText = `
			🗒 نوشته آگهی:  ${lastAdv.text}
			👤 تماس:${lastAdv.username}
			📅 تاریخ:  ${new Date(lastAdv.date).toLocaleDateString('fa-IR')}
			
			🔻 واگذار ${lastAdv.hasTaken ? 'شده' : 'نشده'} 🔺
		`

	const replyMarkup = {
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: 'حذف آگهی ❌',
						callback_data: `delete_${lastAdv._id.toString()}`,
					},
				],
			],
		},
	}

	// set take button
	if (!lastAdv.hasTaken) {
		replyMarkup.reply_markup.inline_keyboard[0].push({
			text: 'ثبت واگذار شدن آگهی ✅',
			callback_data: `present_${lastAdv._id.toString()}`,
		})
	}

	await ctx.telegram.sendMessage(ctx.message.chat.id, advText, replyMarkup)
}

const presentAdv = async ctx => {
	const id = ctx.match.input.substring(8)

	const adv = await Advertisement.findById(id)

	if (!adv) {
		return ctx.reply('مشکلی بوجود آمده است و یا این آگهی وجود ندارد ❌')
	}

	adv.hasTaken = true

	adv.save(async err => {
		if (err) return ctx.reply('مشکلی بوجود آمده است ❌')

		const channelAdv = `
			🔸 ${adv.text}
			
			
			📞 ${adv.username}                                   🔻 واگذار شد 🔺 
			-------------------------
			🔰 ${process.env.CHANNEL_URL}
		`

		ctx.telegram
			.editMessageText(
				process.env.CHANNEL_ID,
				adv.message_id,
				undefined,
				channelAdv,
			)
			.then(() => {
				return ctx.reply('آگهی با موفقیت به حالت واگذار شده تغییر یافت ✅')
			})
			.catch(() => {
				return ctx.reply('مشکلی بوجود آمده است ❌')
			})
	})

	ctx.deleteMessage()
}

module.exports = {
	enterAdvScene,
	sendAdv,
	returnToAdvScene,
	showPrevAdvs,
	deleteAdv,
	showLastAdv,
	presentAdv,
}
