const mongoose = require('mongoose')

mongoose
	.connect(process.env.MONGODB_URI, {
		dbName: process.env.DBNAME,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Mongodb connected')
	})
	.catch(err => {
		console.log(err.message)
	})

mongoose.connection.on('connected', () => {
	console.log('Mongoose connected to db')
})

mongoose.connection.on('error', err => [console.log(err.message)])

mongoose.connection.on('disconnected', () => {
	console.log('Mongoose connection disconnected')
})

process.on('SIGINT', async () => {
	await mongoose.connection.close()
	process.exit(0)
})

// mongoose.set('useFindAndModify', false)
