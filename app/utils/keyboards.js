//https://github.com/RealPeha/telegram-keyboard
const { Keyboard } = require('telegram-keyboard')
const {
	addAdv,
	manageAdvs,
	returnFromAdvsScene,
	lastAdv,
	myBalance,
} = require('./constants')

const mainKeyboard = Keyboard.make([
	[lastAdv, addAdv], // First row
	[manageAdvs, myBalance],
])

advSceneKeyboard = Keyboard.make([[returnFromAdvsScene]])

module.exports = {
	mainKeyboard,
	advSceneKeyboard,
}
