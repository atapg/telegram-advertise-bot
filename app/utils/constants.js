const botName = 'بات تاپ پروژه'
const botId = process.env.BOT_URL
const channelId = process.env.CHANNEL_URL
const addAdv = 'ثبت آگهی 📝'
const manageAdvs = 'آگهی های قبلی من 🗄'
const returnFromAdvsScene = 'بازگشت ⬅️'
const lastAdv = 'آخرین آگهی من 📋'
const myBalance = 'موجودی سکه های من 💰'
const myInvLink = 'لینک دعوت من 🌐'

const coinPerAdv = 10
const startingCoin = 30
const coinPerInv = 5

module.exports = {
	addAdv,
	manageAdvs,
	returnFromAdvsScene,
	botId,
	botName,
	channelId,
	lastAdv,
	myBalance,
	coinPerAdv,
	myInvLink,
	startingCoin,
	coinPerInv,
}
