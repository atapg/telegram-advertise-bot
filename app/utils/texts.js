const { botName, channelId } = require('./constants')

const welcomeText = `
	🔥 <b>به ${botName} خوش آمدید</b>🔥
	
	✅ شما در اینجا می توانید آگهی های پروژه ای خود را بگذارید و در کوتاهترین زمان فردی برای انجام پروژه های خود را پیدا کنید
	
	🔶 نکات :
	
🔸 شما برای درج آگهی های خود می توانید بر روی گزینه ی ثبت آگهی کلیک کنید و با راهتمایی های بات به جلو پیش بروید و آگهی های خود را در داخل چنل ثبت کنید

 🔴 استفاده از خدمات این بات و چنل رایگان میباشد!!! 🔴

🔰 آدرس کانال:
 ${channelId}
`

const addAdvText = `
    <b>لطفا متن آگهی خود را وارد کنید</b>
    <strong>از به کار بردن الفاظ زشت پرهیز کنید</strong>
`

const exampleAdvText = `
	<b>نمونه آگهی: سلام خوب هستین؟ ویس بفرستم؟</b>
`

const addUsernameText = `
	<b>لطفا آی دی یا شماره تلفن جهت درج در آگهی را وارد نمایید</b>
`

module.exports = {
	addAdvText,
	exampleAdvText,
	addUsernameText,
	welcomeText,
}
