const filterText = t => {
	const words = [
		'بیشرف',
		'بی شرف',
		'بیشعور',
		'بی شعور',
		'بی شور',
		'بیشور',
		'کس مادر',
		'قهبه',
		'جنده',
		'مادر قهبه',
		'مادر جنده',
		'خارمادر',
		'خواهرمادر',
		'خواهر مادر',
		'خار مادر',
		'زنا',
		'فهشا',
		'فحشا',
		'سیک',
		'سیکتیر',
		'کص',
		'کیر',
		'کون',
		'کونی',
		'لاشی',
		'کسکش',
		'کس کش',
		'کس مادرت',
		'کس خواهر',
		'کس خواهرت',
		'زنا زاده',
		'زنازاده',
		'کس عمه',
		'کس عمت',
		'کس خاله',
		'کس خالت',
		'امتحان',
	]

	t = ' ' + t + ' '

	t = t.replace(
		new RegExp('\\s+(' + words.join('|') + ')\\s+', 'gi'),
		' ********** ',
	)

	return {
		text: t.trim(),
		ok: !t.trim().includes('**********'),
	}
}

module.exports = { filterText }
