//https://github.com/RealPeha/telegram-keyboard
const { Keyboard } = require('telegram-keyboard')
const { addAdv, manageAdvs, returnFromAdvsScene } = require('./constants')

const mainKeyboard = Keyboard.make([
	[manageAdvs, addAdv], // First row
])

advSceneKeyboard = Keyboard.make([[returnFromAdvsScene]])

module.exports = {
	mainKeyboard,
	advSceneKeyboard,
}
