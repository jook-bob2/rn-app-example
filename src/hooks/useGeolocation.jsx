import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'

/*
 * 현재 위치 정보를 가져오는 훅
 */
export default function useGeolocation() {
	async function getLocation() {
		if (Platform.OS === 'ios') Geolocation.requestAuthorization('always')
		return new Promise((resolve, reject) => {
			Geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords
					resolve({ latitude, longitude, code: 200, message: '요청 성공' })
				},
				(error) => {
					// See error code charts below.
					console.log(error.code, error.message)
					reject({ code: error.code, message: error.message })
				},
				{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
			)
		})
	}
	return {
		getLocation,
	}
}
