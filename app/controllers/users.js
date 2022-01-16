const User = require('../models/users')
const { coinPerAdv } = require('../utils/constants')

const registerUser = async (info, chatId) => {
	const { username, id, first_name } = info.from

	const isUserExists = await findDuplicate(id)

	if (isUserExists) {
		return null
	}

	return await User.create({
		name: first_name,
		telegram_id: id,
		username,
		balance: coinPerAdv,
		chatId: chatId,
	})
}

const findDuplicate = async id => {
	return User.findOne({ telegram_id: id })
}

const setInvId = async (ctx, id, invId) => {
	const user = await User.findOne({ telegram_id: invId })

	if (!user) {
		return ctx.reply('کد دعوت وارد شده نا معتبر می باشد ❌')
	}

	const hasAlreadyInvited = user.invitedUsers.some(i => i === id)

	if (hasAlreadyInvited) {
		return ctx.reply('شما قبلا با این کد دعوت ثبت نام کرده اید ❌')
	} else {
		user.invitedUsers.push(id)
		user.balance = user.balance + 5

		//send ok to invId user
		if (user.chatId) {
			ctx.telegram.sendMessage(
				user.chatId,
				`لینک دعوت شما مورد استفاده قرار گرفت و 5 سکه به صندوق شما اضافه شد ✅`,
			)
		}

		user.save((err, result) => {
			if (err) {
				return ctx.reply('مشکلی بوجود آمده است ❌')
			}
		})
	}
}

module.exports = {
	registerUser,
	setInvId,
}
