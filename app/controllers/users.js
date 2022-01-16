const User = require('../models/users')
const { startingCoin, coinPerInv } = require('../utils/constants')

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
		balance: startingCoin,
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
		user.balance = user.balance + coinPerInv

		//send ok to invId user
		if (user.chatId) {
			ctx.telegram.sendMessage(
				user.chatId,
				`لینک دعوت شما مورد استفاده قرار گرفت و ${coinPerInv} سکه به صندوق شما اضافه شد ✅`,
			)
		}

		user.save()
	}
}

module.exports = {
	registerUser,
	setInvId,
}
