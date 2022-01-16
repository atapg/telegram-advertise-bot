//https://github.com/RealPeha/telegram-keyboard
const { Keyboard } = require('telegram-keyboard')
const {
	addAdv,
	manageAdvs,
	returnFromAdvsScene,
	lastAdv,
	myBalance,
	myInvLink,
} = require('./constants')

const mainKeyboard = Keyboard.make([
	[lastAdv, addAdv],
	[manageAdvs, myBalance],
	[myInvLink],
])

advSceneKeyboard = Keyboard.make([[returnFromAdvsScene]])

module.exports = {
	mainKeyboard,
	advSceneKeyboard,
}
