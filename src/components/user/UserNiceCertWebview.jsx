import { GET_NICE_CERT_REQUEST } from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import { useError } from '@/core/store/common/providers/ErrorProvider'
import constants from '@/navigations/constants'
import { utils } from '@/utils/regularExp'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { useAlert } from '@store/common/providers/AlertProvider'
import React, { useCallback, useRef, useState } from 'react'
import WebView from 'react-native-webview'
import Loading from '../ui/Loading'

const { AUTH_STACK_FLOW, NICE_CERT_SUCCESS_SCREEN } = constants

export default function UserNiceCertWebview({ reqType, params }) {
	const [niceData, setNiceData] = useState({
		encData: '',
		tokenVersionId: '',
		intigretyValue: '',
	})
	const webviewRef = useRef(null)
	const { replace, goBack } = useNavigation()
	const { dispatch: niceDispatch } = useUserContext()
	const { $alert } = useAlert()
	const { $error } = useError()

	useFocusEffect(
		useCallback(() => {
			if (reqType) {
				getNiceCertRequest()
				// GET_NICE_CERT_REQUEST(niceDispatch, { params: { reqType, params } })
				// 	.then((res) => {
				// 		const resData = res.data
				// 		if (resData?.code === 'SUCCESS') {
				// 			const { encData, tokenVersionId, intigretyValue } = res.data.data
				// 			setNiceData({
				// 				encData,
				// 				tokenVersionId,
				// 				intigretyValue,
				// 			})
				// 		} else {
				// 			$alert({
				// 				msg: resData?.msg,
				// 				onPress: (result) => {
				// 					if (result) {
				// 						goBack()
				// 					}
				// 				},
				// 			})
				// 		}
				// 	})
				// 	.catch((err) => {
				// 		console.log('Nice cert request error => ', err)
				// 		const errData = err?.data
				// 		if (errData?.code) {
				// 			const { code, msg } = errData
				// 			setTimeout(() => {
				// 				$error({
				// 					code,
				// 					msg,
				// 					onPress: (result) => {
				// 						if (result) {
				// 							// getEventList()
				// 						}
				// 					},
				// 				})
				// 			}, 1000)
				// 		}
				// 	})
			}
		}, [reqType, params]),
	)

	async function getNiceCertRequest() {
		if (reqType) {
			try {
				const res = await GET_NICE_CERT_REQUEST(niceDispatch, { params: { reqType, params } })
				const resData = res.data
				if (resData?.code === 'SUCCESS') {
					const { encData, tokenVersionId, intigretyValue } = res.data.data
					setNiceData({
						encData,
						tokenVersionId,
						intigretyValue,
					})
				} else {
					$alert({
						msg: resData?.msg,
						onPress: (result) => {
							if (result) {
								goBack()
							}
						},
					})
				}
			} catch (err) {
				console.log('Nice cert request error => ', err)
				const errData = err?.data
				if (errData?.code) {
					const { code, msg } = errData
					setTimeout(() => {
						$error({
							code,
							msg,
							onPress: (result) => {
								if (result) {
									getNiceCertRequest()
								}
							},
						})
					}, 1000)
				}
			}
		}
	}

	// useEffect(() => {
	// 	Linking.addEventListener('url', (e) => {
	// 		console.log('=========== e.url => ', e.url)
	// 		// 앱이 실행되어있는 상태에서 요청이 왔을 때 처리하는 이벤트 등록
	// 		const route = e.url.replace(/.*?:\/\//g, '').split('?')
	// 		const screen = route[0]

	// 		if (screen === NICE_CERT_SUCCESS_SCREEN) {
	// 			const tokenVersionId = utils.getParam(route[1], 'token_version_id')
	// 			const encData = utils.getParam(route[1], 'enc_data', 'encode')
	// 			const integrityValue = utils.getParam(route[1], 'integrity_value')
	// 			const iv = utils.getParam(route[1], 'iv')
	// 			const key = utils.getParam(route[1], 'key')
	// 			replace(screen, { tokenVersionId, encData, integrityValue, iv, key })
	// 		}
	// 	})

	// 	// return () => {
	// 	// 	Linking.removeEventListener('url', (e) => {
	// 	// 		console.log('remove e.url', e.url)
	// 	// 	})
	// 	// }
	// }, [])

	function getHtml() {
		if (niceData.encData && niceData.intigretyValue && niceData.tokenVersionId)
			return `
				<form name="form" id="form">
					<input type="hidden" id="m" name="m" value="checkplusService" />
					<input type="hidden" id="token_version_id" name="token_version_id" value="" />
					<input type="hidden" id="enc_data" name="enc_data" value="W0JAN2E1ZDkzNjk=" />
					<input type="hidden" id="integrity_value" name="integrity_value" value="" />
				</form>
				<script>
					document.form.token_version_id.value = "${niceData.tokenVersionId}"
					document.form.enc_data.value = "${niceData.encData}"
					document.form.integrity_value.value = "${niceData.intigretyValue}"
					document.form.action = "https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb";
					document.form.submit();
				</script>
			`
	}

	return (
		<WebView
			ref={(ref) => {
				if (ref !== null) {
					webviewRef.current = ref
				}
			}}
			source={{
				html: getHtml(),
				baseUrl: 'https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb',
			}}
			style={{ flex: 1 }}
			originWhitelist={['*']}
			useWebKit
			startInLoadingState
			renderLoading={() => <Loading />}
			// sharedCookiesEnabled={true}
			onNavigationStateChange={(e) => {
				//console.log('navState:', e.url)
				if (e.url.startsWith('chabapapp://')) {
					const route = e.url.replace(/.*?:\/\//g, '').split('?')
					//console.log('route::>', route)
					const screen = route[0]
					//console.log('screen::>', screen)
					if (screen === NICE_CERT_SUCCESS_SCREEN) {
						const tokenVersionId = utils.getParam(route[1], 'token_version_id')
						const encData = utils.getParam(route[1], 'enc_data', 'encode')
						const integrityValue = utils.getParam(route[1], 'integrity_value')
						const iv = utils.getParam(route[1], 'iv')
						const key = utils.getParam(route[1], 'key')
						replace(AUTH_STACK_FLOW, {
							screen,
							params: { tokenVersionId, encData, integrityValue, iv, key },
						})

						// Linking.openURL(e.url)
						return false
					}
				}

				return true
			}}
			// onMessage={(e) => {
			// 	console.log('on message => ', e)
			// }}
			// onLoadStart={(e) => {
			// 	console.log('on load start => ', e)
			// }}
			// onLoad={(e) => {
			// 	console.log('on load => ', e)
			// }}
			// onLoadEnd={(e) => {
			// 	console.log('on load end => ', e)
			// }}
			// onShouldStartLoadWithRequest={(e) => {
			// 	console.log('on should start::', e)
			// }}
		/>
	)
}
