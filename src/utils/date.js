import moment from 'moment'

export const defaultFormat = 'YYYY-MM-DD HH:mm:ss'

export function getTodayCal(options = { format: null }) {
	const d = new Date()
	d.setFullYear(d.getFullYear())
	d.setMonth(d.getMonth())
	d.setDate(d.getDate())
	const result = getDateStr(d)
	const { format } = options

	return format ? moment(result).format(format) : result
}

export function getWeekCal(weekNum = 1, options = { format: null }) {
	const d = new Date()
	const weeks = 7
	d.setFullYear(d.getFullYear())
	d.setMonth(d.getMonth())
	d.setDate(d.getDate() - weeks * weekNum)
	const result = getDateStr(d)
	const { format } = options

	return format ? moment(result).format(format) : result
}

export function getMonthCal(monthNum = 1, options = { format: null }) {
	const d = new Date()
	d.setFullYear(d.getFullYear())
	d.setMonth(d.getMonth() - monthNum)
	d.setDate(d.getDate())
	const result = getDateStr(d)
	const { format } = options

	return format ? moment(result).format(format) : result
}

export function getYearCal(yearNum = 1, options = { format: null }) {
	const d = new Date()
	d.setFullYear(d.getFullYear() - yearNum)
	d.setMonth(d.getMonth())
	d.setDate(d.getDate())
	const result = getDateStr(d)
	const { format } = options

	return format ? moment(result).format(format) : result
}

function getDateStr(date) {
	const year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()

	month = month < 10 ? '0' + String(month) : month
	day = day < 10 ? '0' + String(day) : day

	return new Date(year + '-' + month + '-' + day)
}

export function getTotalTime(startTime, endTime) {
	const time1 = moment(startTime)
	const time2 = moment(endTime)

	const diffTime = time2.diff(time1, 'minutes')

	if (diffTime < 60) {
		return diffTime + '분'
	}

	const hour = Math.floor(diffTime / 60)
	const min = diffTime - hour * 60

	return hour + '시간' + min + '분'
}
