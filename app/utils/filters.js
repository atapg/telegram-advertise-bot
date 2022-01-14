const filterText = text => {
	const hasBadWords = text.search('ok')

	console.log(hasBadWords)

	return text
}

module.exports = { filterText }
