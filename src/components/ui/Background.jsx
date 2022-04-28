import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/core'
import React, { memo, useCallback, useEffect, useMemo, Fragment } from 'react'
import { Platform, ToastAndroid, BackHandler, StatusBar } from 'react-native'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import constants from '@/navigations/constants'
import { useBackColor } from '@/core/store/common/providers/BackColorProvider'

const {
	MAIN_SCREEN,
	ON_BOARDING_SCREEN,
	SIGN_IN_SCREEN,
	SIGN_UP_SELECTION_SCREEN,
	PERSON_SIGN_UP_TERMS_SCREEN,
	PERSON_SIGN_UP_PERSON_INPUT_SCREEN,
	PERSON_SIGN_UP_ADDR_SCREEN,
	ADDRESS_FIND_SCREEN,
	PERSON_NICE_CERT_WEBVIEW_SCREEN,
	CORP_NICE_CERT_WEBVIEW_SCREEN,
	MY_INFO_CHANGE_CARD_INFO_SCREEN,
	FIND_PASSWORD_SCREEN,
	FIND_PASSWORD_BY_EMAIL_SCREEN,
	CORP_SIGN_UP_MANAGER_INPUT_SCREEN,
	CORP_SIGN_UP_CORP_INPUT_SCREEN,
	ID_VERIFIED_SCREEN,
	CHARGING_STATION_SEARCH_SCREEN,
	FAQ_LIST_SCREEN,
	MY_INFO_CHANGE_PASSWORD_SCREEN,
	MY_INFO_CHANGE_NEW_PASSWORD_SCREEN,
	BOOKMARK_DETAIL_SCREEN,
} = constants

const Top = styled.SafeAreaView`
	flex: 0;
	background-color: ${({ routeName, topColor }) => {
		let color = ''
		switch (routeName) {
			case ON_BOARDING_SCREEN:
				color = topColor ? topColor : theme.colors.background
				break
			case MAIN_SCREEN:
				color = theme.colors.background
				break
			case SIGN_IN_SCREEN:
				color = theme.colors.white
				break
			case SIGN_UP_SELECTION_SCREEN:
				color = theme.colors.background
				break
			default:
				color = theme.colors.white
				break
		}

		return color
	}};
`

const Bottom = styled.SafeAreaView`
	flex: 1;
	background-color: ${({ routeName, bottomColor }) => {
		let color = ''
		switch (routeName) {
			case ON_BOARDING_SCREEN:
				color = bottomColor ? bottomColor : theme.colors.background
				break
			case SIGN_IN_SCREEN:
				color = theme.colors.white
				break
			case PERSON_SIGN_UP_TERMS_SCREEN:
				color = theme.colors.white
				break
			case PERSON_SIGN_UP_PERSON_INPUT_SCREEN:
				color = theme.colors.white
				break
			case PERSON_SIGN_UP_ADDR_SCREEN:
				color = theme.colors.white
				break
			case ADDRESS_FIND_SCREEN:
				color = bottomColor ? bottomColor : theme.colors.white
				break
			case ID_VERIFIED_SCREEN:
				color = theme.colors.white
				break
			case FIND_PASSWORD_SCREEN:
				color = theme.colors.white
				break
			case CORP_SIGN_UP_MANAGER_INPUT_SCREEN:
				color = theme.colors.white
				break
			case CORP_SIGN_UP_CORP_INPUT_SCREEN:
				color = theme.colors.white
				break
			case PERSON_NICE_CERT_WEBVIEW_SCREEN:
				color = theme.colors.white
				break
			case CORP_NICE_CERT_WEBVIEW_SCREEN:
				color = theme.colors.white
				break
			case MY_INFO_CHANGE_CARD_INFO_SCREEN:
				color = theme.colors.white
				break
			case FIND_PASSWORD_BY_EMAIL_SCREEN:
				color = theme.colors.white
				break
			case CHARGING_STATION_SEARCH_SCREEN:
				color = theme.colors.white
				break
			case FAQ_LIST_SCREEN:
				color = theme.colors.white
				break
			case MY_INFO_CHANGE_PASSWORD_SCREEN:
				color = theme.colors.white
				break
			case MY_INFO_CHANGE_NEW_PASSWORD_SCREEN:
				color = theme.colors.white
				break
			case BOOKMARK_DETAIL_SCREEN:
				color = bottomColor ? bottomColor : theme.colors.white
				break
			default:
				color = theme.colors.background
				break
		}

		return color
	}};
`

const Contents = styled.View`
	width: 100%;
	height: 100%;
`

const Background = ({ children, options = { isFlat: false } }) => {
	const { goBack, getState, canGoBack } = useNavigation()
	const route = useRoute()
	let exitApp = false
	const {
		backColorState: { topColor, bottomColor },
	} = useBackColor()
	const statusBarColor = useMemo(() => getStatusBarColor(), [topColor])

	useEffect(() => {
		return () => {
			exitApp = false
			BackHandler.removeEventListener('hardwareBackPress', () =>
				handleBackButton({ routeName: route.name, exitAppCopy: exitApp }),
			)
		}
	}, [])

	useFocusEffect(
		useCallback(() => {
			let naviHistory = getState().history
			let rName = ''

			if (naviHistory && naviHistory.length > 0) {
				rName = naviHistory[naviHistory.length - 1].key.split('-')[0]
			}

			BackHandler.addEventListener('hardwareBackPress', () =>
				handleBackButton({ routeName: rName || route.name, exitAppCopy: exitApp }),
			)
		}, [route]),
	)

	function handleBackButton({ routeName, exitAppCopy }) {
		if (Platform.OS === 'android') {
			if (routeName === MAIN_SCREEN || routeName === ON_BOARDING_SCREEN || !canGoBack()) {
				let timeout
				// 2초안에 back 키를 한번 더 누를 경우 앱 종료
				if (!exitAppCopy) {
					ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT)
					exitApp = true

					timeout = setTimeout(() => {
						exitApp = false
					}, 2000)

					return true
				} else if (exitAppCopy) {
					clearTimeout(timeout)
					BackHandler.exitApp()
					return true
				}
			} else {
				goBack()
				return true
			}
		}
		return false
	}

	function getStatusBarColor() {
		const routeName = route.name
		let color = ''
		switch (routeName) {
			case ON_BOARDING_SCREEN:
				color = topColor ? topColor : theme.colors.background
				break
			case MAIN_SCREEN:
				color = theme.colors.background
				break
			case SIGN_IN_SCREEN:
				color = theme.colors.white
				break
			case SIGN_UP_SELECTION_SCREEN:
				color = theme.colors.background
				break
			default:
				color = theme.colors.white
				break
		}

		return color
	}

	return (
		<Fragment>
			<Top routeName={route.name} topColor={topColor} />
			<Bottom routeName={route.name} bottomColor={bottomColor}>
				<StatusBar
					backgroundColor={statusBarColor}
					animated={true}
					barStyle={'dark-content'}
					showHideTransition="slide"
					hidden={false}
				/>
				<Contents>{children}</Contents>
			</Bottom>
		</Fragment>
	)
}

export default memo(Background)
