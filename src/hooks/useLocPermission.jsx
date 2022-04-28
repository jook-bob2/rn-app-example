import { Platform } from 'react-native'
import { check, checkMultiple, PERMISSIONS, request, requestMultiple, RESULTS } from 'react-native-permissions'

/*
 * 위치 정보 권한 체크
 */
export default function useLocPermission() {
	async function onCheckLocationPermission() {
		if (Platform.OS === 'ios') {
			try {
				const status = await check(PERMISSIONS.IOS.LOCATION_ALWAYS)
				if (status !== RESULTS.GRANTED) {
					try {
						const status2 = await request(PERMISSIONS.IOS.LOCATION_ALWAYS)
						return status2 === RESULTS.GRANTED ? true : false
					} catch (error) {
						console.log('on request location permission error => ', error)
					}
				}

				return true
			} catch (error) {
				console.log('on check location permission error => ', error)
			}
		} else {
			try {
				const statuses = await checkMultiple([
					PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
					PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
				])
				if (
					statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] !== RESULTS.GRANTED ||
					statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] !== RESULTS.GRANTED
				) {
					try {
						const statuses2 = await requestMultiple([
							PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
							PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
						])
						return statuses2[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === RESULTS.GRANTED &&
							statuses2[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
							? true
							: false
					} catch (error) {
						console.log('on request location permission error => ', error)
					}
				}
				return true
			} catch (error) {
				console.log('on check location permission error => ', error)
			}
		}
	}

	return {
		onCheckLocationPermission,
	}
}
