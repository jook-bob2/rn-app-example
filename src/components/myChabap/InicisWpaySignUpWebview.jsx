import React, { useCallback, useRef, useState } from 'react'
import { GET_WPAY_MEM_REQUEST } from '@/core/store/api/create/inicisCreate'
import { useInicisContext } from '@/core/store/api/providers/InicisApiProvider'
import constants from '@/navigations/constants'
import { utils } from '@/utils/regularExp'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import WebView from 'react-native-webview'
import Loading from '../ui/Loading'
import { API_URL } from '../../../env.json'

const { MY_CHABAP_TAB_FLOW, INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN } = constants

export default function InicisWpaySignUpWebview({ params }) {
	const webviewRef = useRef(null)
	const [key, setKey] = useState(0)
	const { replace, goBack } = useNavigation()
	const { state, dispatch } = useInicisContext()
	const { data: memRequestData } = state.wpayMemRequest
	const memRequest = memRequestData?.data

	useFocusEffect(
		useCallback(() => {
			getWpayMemRequest()

			setKey(1)

			return () => {
				setKey(0)
			}
		}, []),
	)

	async function getWpayMemRequest() {
		try {
			await GET_WPAY_MEM_REQUEST(dispatch)
			// console.log(response)
			// if (response?.data.success) {
			// 	setMemRequest(response.data.data)
			// }
		} catch (error) {
			console.log(error)
		}
	}

	function getHtml() {
		if (key === 1 && memRequest)
			return `
			<form name="SendMemregForm" method="post">

				<!--*************************필수 세팅 부분************************************-->
				<!-- 가맹점 ID -->
				<input type="hidden" name="mid" id="mid" value="${memRequest.mid}" />
				<!-- 가맹점 고객 ID -->
				<input type="hidden" name="userId" id="userId" value="${memRequest.userId}" />
				<!-- 회원가입 결과전달 URL -->
				<input type="hidden" name="returnUrl" id="returnUrl" value="${memRequest.returnUrl}" />
				<!-- HashValue -->
				<input type="hidden" name="signature" id="signature" value="${memRequest.signature}" />

				<!-- 커스텀 CSS URL -->
				<input type="hidden" name="resetCssUrl" id="resetCssUrl" value="${API_URL}/css/custom_guide.css" />
				
			</form>
			
			<script>
				myform = document.SendMemregForm;
				myform.action = "https://wpaystd.inicis.com/stdwpay/std/u/v1/memreg";
				myform.target = "_self";
				myform.submit();
			</script>
			`
	}
	// <input type="hidden" name="resetCssUrl" id="resetCssUrl" value="http://localhost:8080/static/css/custom_guide.css" />

	return (
		<>
			<WebView
				key={key}
				ref={(ref) => {
					webviewRef.current = ref
				}}
				source={{
					html: getHtml(),
					baseUrl: 'https://wpaystd.inicis.com/stdwpay/std/u/v1/memreg',
				}}
				style={{ flex: 1 }}
				originWhitelist={['*']}
				renderLoading={() => <Loading />}
				onNavigationStateChange={(e) => {
					console.log('navState:', e.url)

					// if (e.url.startsWith('chabapapp://') && Platform.OS === 'android') {
					// 	const route = e.url.replace(/.*?:\/\//g, '').split('?')
					// 	console.log('route::>', route)
					// 	const screen = route[0]
					// 	console.log('screen::>', screen)

					// 	const resultCode = utils.getParam(route[1], 'resultCode')
					// 	const resultMsg = utils.getParam(route[1], 'resultMsg')

					// 	if (resultCode === '0000' || resultCode === '2006') {
					// 		navigate(MY_CHABAP_TAB_FLOW, {
					// 			screen: INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN,
					// 			params: {
					// 				resultCode,
					// 				resultMsg,
					// 				returnUrl: params.returnUrl,
					// 			},
					// 		})
					// 		return false
					// 	}
					// 	goBack()
					// 	return false
					// }
				}}
				onShouldStartLoadWithRequest={(request) => {
					console.log('onShouldStartLoadWithRequest => ', request)

					const { url } = request

					if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('about:blank')) {
						return true
					}

					if (url.startsWith('chabapapp://')) {
						// if (Platform.OS === 'android') {
						// 	return false
						// }

						const route = url.replace(/.*?:\/\//g, '').split('?')
						console.log('route::>', route)
						const screen = route[0]
						console.log('screen::>', screen)

						const resultCode = utils.getParam(route[1], 'resultCode')
						const resultMsg = utils.getParam(route[1], 'resultMsg')

						if (resultCode === '0000') {
							replace(MY_CHABAP_TAB_FLOW, {
								screen: INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN,
								params: {
									resultCode,
									resultMsg,
									returnUrl: params.returnUrl,
								},
							})
							return false
						}
						goBack()
						return false
					}
				}}
			/>
		</>
	)
}
