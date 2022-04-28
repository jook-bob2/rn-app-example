import { Linking, Platform } from 'react-native'

/*
 * 네이버 내비 바로가기
 * @param slat 출발 위도
 * @param slng 출발 경도
 * @param sname 출발 장소
 * @param dlat 도착 위도
 * @param dlng 도착 경도
 * @param dname 도착 장소
 */
export async function nmapOpen({ slat, slng, sname, dlat, dlng, dname, installed }) {
	// nmap://route/car?slat=37.4640070&slng=126.9522394&sname=%EC%84%9C%EC%9A%B8%EB%8C%80%ED%95%99%EA%B5%90&dlat=37.5209436&dlng=127.1230074&dname=%EC%98%AC%EB%A6%BC%ED%94%BD%EA%B3%B5%EC%9B%90&appname=com.example.myapp
	const url = `nmap://route/car?slat=${slat}&slng=${slng}&sname=${sname}&dlat=${dlat}&dlng=${dlng}&dname=${dname}&appname=kr.co.chabap`
	const alterUrl =
		Platform.OS === 'ios'
			? 'https://itunes.apple.com/app/id311867728?mt=8'
			: 'market://details?id=com.nhn.android.nmap'

	// const supported = await Linking.canOpenURL(url)

	if (installed) {
		await Linking.openURL(url)
	} else {
		await Linking.openURL(alterUrl)
	}
}

/*
 * 카카오 내비 바로가기
 * @param sp 출발 위경도
 * @param ep 도착 위경도
 */
export async function kakaoMapOpen({ sp, ep, installed }) {
	// kakaomap://route?sp=37.537229,127.005515&ep=37.4979502,127.0276368&by=CAR
	const url = `kakaomap://route?sp=${sp}&ep=${ep}&by=CAR`
	const alterUrl =
		Platform.OS === 'ios'
			? 'https://itunes.apple.com/app/id304608425?mt=8'
			: 'market://details?id=net.daum.android.map'

	// const supported = await Linking.canOpenURL(url)

	if (installed) {
		await Linking.openURL(url)
	} else {
		await Linking.openURL(alterUrl)
	}
}

/*
 * 티맵 바로가기
 * @param rGoName 도착 장소
 * @param rGoX 도착 경도
 * @param rGoY 도착 위도
 */
export async function tMapOpen({ rGoName, rGoX, rGoY, installed }) {
	// tmap://route?goalname=[장소]&goalx=[경도값]&goaly=[위도값]
	const url = `tmap://route?goalname=${rGoName}&goalx=${rGoX}&goaly=${rGoY}`
	// const url = 'tmap://?rGoName=사당역&rGoX=126.981633&rGoY=37.476559'
	const alterUrl =
		Platform.OS === 'ios'
			? 'https://itunes.apple.com/app/t-map-for-sk/id431589174?mt=8'
			: 'market://details?id=com.skt.tmap.ku'

	// const supported = await Linking.canOpenURL(url)

	if (installed) {
		await Linking.openURL(url)
	} else {
		await Linking.openURL(alterUrl)
	}
}
