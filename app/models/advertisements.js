const mongoose = require('mongoose')

const advSchema = mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
	telegram_id: {
		type: Number,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	message_id: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		default: new Date(),
	},
	hasTaken: {
		type: Boolean,
		default: false,
	},
})

module.exports = mongoose.model('advertisement', advSchema)
