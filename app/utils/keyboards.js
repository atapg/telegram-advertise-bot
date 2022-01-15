//https://github.com/RealPeha/telegram-keyboard
const { Keyboard } = require('telegram-keyboard')
const {
	addAdv,
	manageAdvs,
	returnFromAdvsScene,
	lastAdv,
} = require('./constants')

const mainKeyboard = Keyboard.make([
	[lastAdv, addAdv], // First row
	[manageAdvs],
])

advSceneKeyboard = Keyboard.make([[returnFromAdvsScene]])

module.exports = {
	mainKeyboard,
	advSceneKeyboard,
}
