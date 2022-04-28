import React, { useRef, useCallback, useState } from 'react'
import WebView from 'react-native-webview'
import Loading from '../ui/Loading'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { useInicisContext } from '@/core/store/api/providers/InicisApiProvider'
import { GET_WPAY_AUTH_REQUEST } from '@/core/store/api/create/inicisCreate'
import constants from '@/navigations/constants'
import { utils } from '@/utils/regularExp'
import { API_URL } from '../../../env.json'

const { MY_CHABAP_TAB_FLOW, INICIS_PAYMENT_RESULT_SCREEN } = constants

export default function InicisWpayPaymentWebview({ params }) {
	const webviewRef = useRef(null)
	const [key, setKey] = useState(0)
	const { replace, goBack } = useNavigation()
	const { paymentId, amount, wpayToken, payMethod, bankCardCode } = params
	const { state, dispatch } = useInicisContext()
	const { data: wpayAuthRequestData } = state.wpayAuthRequest
	const authRequest = wpayAuthRequestData?.data

	useFocusEffect(
		useCallback(() => {
			setKey(1)

			return () => {
				setKey(0)
			}
		}, []),
	)

	useFocusEffect(
		useCallback(() => {
			if (params) {
				getWpayAuthRequest()
			}
		}, [params]),
	)

	async function getWpayAuthRequest() {
		try {
			const response = await GET_WPAY_AUTH_REQUEST(dispatch, {
				paymentId,
				wpayToken,
				payMethod,
				bankCardCode,
				goodsName: 'Chabap 충전',
				goodsPrice: amount,
			})
			console.log('getWpayAuthRequest response : ', response)
		} catch (error) {
			console.log('getWpayAuthRequest Error : ', error)
		}
	}

	function getHtml() {
		if (key === 1 && authRequest)
			return `
                <form name="SendMemregForm" method="post">
                    <!--*************************필수 세팅 부분************************************-->
                    <input type="hidden" name="mid" id="mid" value="${authRequest.mid}" />
                    <input type="hidden" name="wpayUserKey" id="wpayUserKey" value="${authRequest.wpayUserKey}" />
                    <input type="hidden" name="wpayToken" id="wpayToken" value="${authRequest.wpayToken}" />
                    <input type="hidden" name="ci" id="ci" value="${authRequest.ci}" />
                    <input type="hidden" name="payMethod" id="payMethod" value="${authRequest.payMethod}" />
                    <input type="hidden" name="bankCardCode" id="bankCardCode" value="${authRequest.bankCardCode}" />
                    <input type="hidden" name="oid" id="oid" value="${authRequest.oid}" />
                    <input type="hidden" name="goodsName" id="goodsName" value="${authRequest.goodsName}" />
                    <input type="hidden" name="goodsPrice" id="goodsPrice" value="${authRequest.goodsPrice}" />
                    <input type="hidden" name="buyerName" id="buyerName" value="${authRequest.buyerName}" />
                    <input type="hidden" name="buyerTel" id="buyerTel" value="${authRequest.buyerTel}" />
                    <input type="hidden" name="buyerEmail" id="buyerEmail" value="${authRequest.buyerEmail}" />
                    <input type="hidden" name="cardQuota" id="cardQuota" value="${authRequest.cardQuota}" />
                    <input type="hidden" name="cardInterest" id="cardInterest" value="${authRequest.cardInterest}" />
                    <input type="hidden" name="couponCode" id="couponCode" value="${authRequest.couponCode}" />
                    <input type="hidden" name="flagPin" id="flagPin" value="${authRequest.flagPin}" />
                    <input type="hidden" name="flagCardPoint" id="flagCardPoint" value="" />
                    <input type="hidden" name="returnUrl" id="returnUrl" value="${authRequest.returnUrl}" />
                    <input type="hidden" name="signature" id="signature" value="${authRequest.signature}" />

					<!-- 커스텀 CSS URL -->
					<input type="hidden" name="resetCssUrl" id="resetCssUrl" value="${API_URL}/css/custom_guide.css" />
                </form>

                <script>
                    myform = document.SendMemregForm;
                    myform.action = "https://wpaystd.inicis.com/stdwpay/std/u/v1/payauth/card";
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
					baseUrl: 'https://wpaystd.inicis.com/stdwpay/std/u/v1/payauth/car',
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
					// 		replace(MY_CHABAP_TAB_FLOW, {
					// 			screen: INICIS_PAYMENT_RESULT_SCREEN,
					// 			params: {
					// 				resultCode,
					// 				resultMsg,
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
								screen: INICIS_PAYMENT_RESULT_SCREEN,
								params: {
									resultCode,
									resultMsg,
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
