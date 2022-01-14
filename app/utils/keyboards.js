//https://github.com/RealPeha/telegram-keyboard
const { Keyboard } = require('telegram-keyboard')
const { Markup } = require('telegraf')
const { addAdv, manageAdvs, returnFromAdvsScene } = require('./constants')

const mainKeyboard = Keyboard.make([
	[manageAdvs, addAdv], // First row
])

advSceneKeyboard = Keyboard.make([[returnFromAdvsScene]])

const remove_keyboard = Markup.removeKeyboard()

module.exports = {
	mainKeyboard,
	advSceneKeyboard,
}
