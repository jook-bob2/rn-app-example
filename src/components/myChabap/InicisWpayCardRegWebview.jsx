import React, { useCallback, useRef, useState } from 'react'
import { GET_WPAY_CARD_REQUEST } from '@/core/store/api/create/inicisCreate'
import { useInicisContext } from '@/core/store/api/providers/InicisApiProvider'
import constants from '@/navigations/constants'
import { utils } from '@/utils/regularExp'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import WebView from 'react-native-webview'
import Loading from '../ui/Loading'
import { API_URL } from '../../../env.json'

const { MY_CHABAP_TAB_FLOW } = constants

export default function InicisWpayCardRegWebview({ params }) {
	const webviewRef = useRef(null)
	const [key, setKey] = useState(0)
	const { replace } = useNavigation()
	const { state, dispatch } = useInicisContext()
	const { data: cardRequestData } = state.wpayCardRequest
	const cardRequest = cardRequestData?.data

	useFocusEffect(
		useCallback(() => {
			getWpayCardRequest()

			setKey(1)

			return () => {
				setKey(0)
			}
		}, []),
	)

	async function getWpayCardRequest() {
		try {
			const response = await GET_WPAY_CARD_REQUEST(dispatch)
			console.log('wpay card Request : ', response)
		} catch (error) {
			console.log('wpay card Request Error ==> ', error)
		}
	}

	function getHtml() {
		if (key === 1 && cardRequest)
			return `
			<form name="SendMemregForm" method="post"> 
			
				<!--*************************필수 세팅 부분************************************-->
				<!-- 가맹점 ID -->
				<input type="hidden" name="mid" id="mid" value="${cardRequest.mid}" />	
				<!-- 이니시스에서 발행한 wpayUserKey -->
				<input  type="hidden" name="wpayUserKey" id="wpayUserKey" value="${cardRequest.wpayUserKey}" />
				<!-- 고객의 CI -->
				<input type="hidden" name="ci" id="ci" value="${cardRequest.ci}" />
				<!-- 회원가입 결과전달 URL -->
				<input  type="hidden" name="returnUrl" id="returnUrl" value="${cardRequest.returnUrl}" />
				<!-- HashValue -->
				<input type="hidden" name="signature" id="signature" value="${cardRequest.signature}" />

				<!-- 커스텀 CSS URL -->
				<input type="hidden" name="resetCssUrl" id="resetCssUrl" value="${API_URL}/css/custom_guide.css" />

			</form>

			<script>
				myform = document.SendMemregForm;
				myform.action = "https://wpaystd.inicis.com/stdwpay/std/u/v1/payreg/card";
				myform.target = "_self";
				myform.submit();
			</script>
			`
	}

	return (
		<>
			<WebView
				key={key}
				ref={(ref) => {
					if (ref !== null) {
						webviewRef.current = ref
					}
				}}
				source={{
					html: getHtml(),
					baseUrl: 'https://wpaystd.inicis.com/stdwpay/std/u/v1/payreg/card',
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

					// 	if (resultCode === '0000') {
					// 		let data = {}

					// 		if (params?.isNewMember) {
					// 			data = { isNewMember: params.isNewMember }
					// 		}

					// 		navigate(MY_CHABAP_TAB_FLOW, {
					// 			screen: params.returnUrl,
					// 			params: {
					// 				resultCode,
					// 				resultMsg,
					// 				data,
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

						let data = {}

						if (params?.isNewMember) {
							data = { isNewMember: params.isNewMember }
						}

						replace(MY_CHABAP_TAB_FLOW, {
							screen: params.returnUrl,
							params: {
								resultCode,
								resultMsg,
								data,
							},
						})

						return false
					}
				}}
			/>
		</>
	)
}
