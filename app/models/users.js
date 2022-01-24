const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	telegram_id: {
		type: Number,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		unique: false,
	},
	balance: {
		type: Number,
		default: 0,
	},
	invitedUsers: {
		type: Array,
	},
	chatId: {
		type: Number,
		required: true,
	},
})

module.exports = mongoose.model('user', userSchema)
