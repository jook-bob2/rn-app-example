import AsyncStorage from '@react-native-community/async-storage'

const defaultOptions = {
	addYear: 0,
	addMonth: 0,
	addDate: 0,
	addHours: 0,
	addMinutes: 0,
}

export const storageUtil = {
	setItem: ({ key, value, options = { ...defaultOptions } }) => {
		options = { ...defaultOptions, ...options }
		let d = new Date()
		let creation = d.getTime()
		d.setFullYear(d.getFullYear() + Number(options.addYear))
		d.setMonth(d.getMonth() + Number(options.addMonth))
		d.setDate(d.getDate() + Number(options.addDate))
		d.setHours(d.getHours() + Number(options.addHours))
		d.setMinutes(d.getMinutes() + Number(options.addMinutes))
		let expiration = new Date(d).getTime()

		return new Promise((resolve) => {
			AsyncStorage.setItem(key, JSON.stringify({ data: value, creation, expiration }), () => {
				resolve(value)
			})
		})
	},
	getItem: ({ key }) => {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(key, (error, result) => {
				if (storageUtil.isJsonString(result)) resolve(JSON.parse(result))
				else reject(error)
			})
		})
	},
	removeItem: ({ key }) => {
		return new Promise((resolve) => {
			AsyncStorage.removeItem(key, () => {
				resolve(true)
			})
		})
	},
	isJsonString: (value) => {
		try {
			const json = JSON.parse(value)
			return typeof json === 'object'
		} catch (e) {
			return false
		}
	},
}
