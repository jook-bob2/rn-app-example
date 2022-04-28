import React, { useCallback, useRef, useState } from 'react'
import { Linking, Platform } from 'react-native'
import { API_URL } from '../../../env.json'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import WebView from 'react-native-webview'
import Loading from '../ui/Loading'
import constants from '@/navigations/constants'
import { utils } from '@/utils/regularExp'
import SendIntentAndroid from 'react-native-send-intent'
import { useUser } from '@/core/store/common/providers/UserProvider'

const { MY_CHABAP_TAB_FLOW, INICIS_PAYMENT_RESULT_SCREEN } = constants

export default function InicisPaymentWebview({ params }) {
	const webviewRef = useRef(null)
	const [key, setKey] = useState(0)
	const { replace, goBack } = useNavigation()
	const { paymentId, simplePayMethod, amount } = params
	const {
		userState: { name },
	} = useUser()

	useFocusEffect(
		useCallback(() => {
			setKey(1)

			return () => {
				setKey(0)
			}
		}, []),
	)

	function getHtml() {
		if (key === 1 && paymentId)
			return `
				<!-- 인코딩 euc-kr 필수 -->
				<form name="mobileweb" method="post" accept-charset="euc-kr"> 
				
				<!--*************************필수 세팅 부분************************************-->
				
					<!-- 리턴받는 가맹점 URL 세팅 -->
					<input type="hidden" name="P_NEXT_URL" value="${API_URL}/inicis/appr-res?paymentId=${paymentId}"> 
					
					<!-- 지불수단 선택 (신용카드,계좌이체,가상계좌,휴대폰) -->
					<input type="hidden" name="P_INI_PAYMENT" value="${simplePayMethod.includes('d_') ? 'CARD' : simplePayMethod}">
					
					<!-- 복합/옵션 파라미터 -->
					
					<input type="hidden" name="P_RESERVED" value="below1000=Y&twotrs_isp=Y&block_isp=Y&twotrs_isp_noti=N&apprun_check=Y&app_scheme=${
						Platform.OS === 'ios' && simplePayMethod.includes('d_kakaopay')
							? 'kakaotalk://'
							: 'chabapapp://'
					}${simplePayMethod.includes('d_') ? '&' + simplePayMethod : ''}">

					<input type="hidden" name="P_MID" value="INIpayTest"> <!-- 에스크로테스트 : iniescrow0, 모바일빌링(정기과금)은 별도연동필요 -->
					<input type="hidden" name="P_OID" value="test_oid_123456">  
					<input type="hidden" name="P_GOODS" value="Chabap 충전"> 
					<input type="hidden" name="P_AMT" value="${amount}"> 
					<input type="hidden" name="P_UNAME" value="${name}"> 
				
				<!--*************************선택 필수 세팅 부분************************************--> 
					
					<!-- 가상계좌 입금 노티 사용시 필수 -->
					<input type="hidden" name="P_NOTI_URL" value="">  
					
					<!-- 휴대폰결제 필수 [1:컨텐츠, 2:실물] -->
					<input type="hidden" name="P_HPP_METHOD" value="1">  
					
				</form>
	
				<script>
					myform = document.mobileweb; 
					myform.action = "https://mobile.inicis.com/smart/payment/";
					myform.target = "_self";
					myform.submit(); 
				</script>
			`
	}

	const onShouldStartLoadWithRequest = (request) => {
		const { url } = request
		console.log('onShouldStartLoadWithRequest => ', request)

		if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('about:blank')) {
			return true
		}

		if (url.startsWith('intent://') && Platform.OS === 'android') {
			Linking.canOpenURL(url)
				.then((res) => {
					if (res) {
						Linking.openURL(url).catch((error) => {
							console.log('앱 실행에 실패했습니다. => ', error)
						})
					} else {
						SendIntentAndroid.openAppWithUri(url)
							.then((isOpened) => {
								if (!isOpened) {
									console.log('앱 실행에 실패했습니다')
								}
							})
							.catch((err) => {
								console.log(err)
							})
					}
				})
				.catch((error) => {
					console.log('앱 실행에 실패했습니다. => ', error)
				})
		} else {
			Linking.openURL(url).catch((error) => {
				console.log('앱 실행에 실패했습니다. => ', error)
			})

			console.log('ISP 결제창 open 이후')
			console.log('url : ', url)

			if (url.startsWith('chabapapp://') && Platform.OS === 'ios') {
				const route = url.replace(/.*?:\/\//g, '').split('?')
				console.log('route::>', route)
				const screen = route[0]
				console.log('screen::>', screen)
				const resultCode = utils.getParam(route[1], 'resultCode')
				const resultMsg = utils.getParam(route[1], 'resultMsg')

				if (resultCode === '00') {
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

			return false
		}

		return false
	}

	return (
		<WebView
			key={key}
			ref={(ref) => {
				if (ref !== null) {
					webviewRef.current = ref
				}
			}}
			source={{
				html: getHtml(),
				baseUrl: 'https://mobile.inicis.com/smart/payment/',
			}}
			style={{ flex: 1 }}
			originWhitelist={['*']}
			renderLoading={() => <Loading />}
			onNavigationStateChange={(e) => {
				console.log('navState:', e.url)

				if (e.url.startsWith('chabapapp://') && Platform.OS === 'android') {
					const route = e.url.replace(/.*?:\/\//g, '').split('?')
					console.log('route::>', route)
					const screen = route[0]
					console.log('screen::>', screen)

					const resultCode = utils.getParam(route[1], 'resultCode')
					const resultMsg = utils.getParam(route[1], 'resultMsg')

					if (resultCode === '00') {
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
			onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
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
		/>
	)
}
