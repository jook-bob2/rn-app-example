import React, { memo, useEffect } from 'react'
import styled from 'styled-components/native'
import { Platform, StatusBar, StyleSheet } from 'react-native'
import Left from './view/Left'
import { theme } from '@/theme'
import constants from '@/navigations/constants'
import { useUser } from '@/core/store/common/providers/UserProvider'
import { useUserSelect } from '@/core/store/common/providers/UserSelectProvider'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import Right from './view/Right'
import Subtitle from './text/Subtitle'
import { ArrowDownSvg, ArrowPrevSvg, NotificationOnSvg, NotificationSvg, CloseSvg } from '@/utils/svgUtil'
import Paragraph from './text/Paragraph'
import Center from './view/Center'
import { useMessageContext } from '@/core/store/api/providers/MessageApiProvider'
import { GET_UNREAD_COUNT } from '@/core/store/api/create/messageCreate'
import { useConnector } from '@/core/store/common/providers/ConnectorStatusProvider'
import { useDeviceOrientation } from '@react-native-community/hooks'

const {
	MAIN_SCREEN,
	AUTH_STACK_FLOW,
	SIGN_IN_SCREEN,
	MY_CHABAP_TAB_FLOW,
	NOTICE_ALARM_SCREEN,
	INICIS_PAYMENT_WEBVIEW_SCREEN,
} = constants

const Top = styled.SafeAreaView`
	background-color: ${({ isMain }) => (isMain ? theme.colors.background : theme.colors.white)};
`

const Wrapper = styled.View`
	flex-direction: row;
	align-self: center;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: ${verticalScale(80)}px;
	padding-left: ${({ isMain }) => (isMain ? horizontalScale(24) : horizontalScale(13))}px;
	padding-right: ${horizontalScale(15)}px;
	background-color: ${({ isMain }) => (isMain ? theme.colors.background : theme.colors.white)};
`

const NoneMainPress = styled.Pressable``

const MainPress = styled.Pressable``

const ArrowView = styled.View`
	top: ${Platform.OS === 'ios' ? verticalScale(12) : verticalScale(10)}px;
	left: ${horizontalScale(10)}px;
`

const Header = ({ options, navigation, route }) => {
	const title =
		options.headerTitle !== undefined ? options.headerTitle : options.title !== undefined ? options.title : null

	const { goBack, navigate } = navigation

	const {
		userState: { isLoggined },
	} = useUser()
	const { $userSelect } = useUserSelect()
	const { connectorState } = useConnector()

	const { state: msgState, dispatch: msgDispatch } = useMessageContext()
	const { data: unreadData } = msgState.unreadCount
	const unreadCount = unreadData?.data || 0

	useDeviceOrientation()

	useEffect(() => {
		getUnreadCount()
	}, [isLoggined, connectorState])

	function getUnreadCount() {
		if (isLoggined === true) {
			setTimeout(async () => {
				try {
					await GET_UNREAD_COUNT(msgDispatch)
				} catch (error) {
					console.log('unread count error => ', error)
				}
			}, 0)
		}
	}

	function handlePressToggle() {
		if (options.isBack) {
			goBack()
		}
	}

	return (
		<>
			<Top isMain={route.name === MAIN_SCREEN ? true : false}>
				<StatusBar
					backgroundColor={route.name === MAIN_SCREEN ? theme.colors.background : theme.colors.white}
					animated={true}
					barStyle={'dark-content'}
					showHideTransition="slide"
					hidden={false}
				/>
			</Top>

			<Wrapper isMain={route.name === MAIN_SCREEN ? true : false}>
				{options.isBack && (
					<>
						<NoneMainPress onPress={() => handlePressToggle()}>
							<Left>
								{route.name === INICIS_PAYMENT_WEBVIEW_SCREEN ? (
									<CloseSvg width={moderateScale(24)} height={moderateScale(24)} />
								) : (
									<ArrowPrevSvg width={moderateScale(24)} height={moderateScale(24)} />
								)}
							</Left>
						</NoneMainPress>
						<Center>
							<Paragraph>{title}</Paragraph>
						</Center>
						<Right style={{ marginRight: moderateScale(25) }}></Right>
					</>
				)}
				{route.name === MAIN_SCREEN && isLoggined ? (
					<MainPress onPress={() => $userSelect()}>
						<Left>
							<Subtitle style={styles.text}>{title}</Subtitle>
							<ArrowView>
								<ArrowDownSvg width={moderateScale(12)} height={moderateScale(7)} />
							</ArrowView>
						</Left>
					</MainPress>
				) : route.name === MAIN_SCREEN && !isLoggined ? (
					<MainPress onPress={() => navigate(AUTH_STACK_FLOW, { screen: SIGN_IN_SCREEN })}>
						<Left>
							<Subtitle style={styles.text}>{title}</Subtitle>
							<ArrowView>
								<ArrowDownSvg width={moderateScale(12)} height={moderateScale(7)} />
							</ArrowView>
						</Left>
					</MainPress>
				) : null}

				{options.isNotification && route.name === MAIN_SCREEN && isLoggined && (
					<MainPress onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: NOTICE_ALARM_SCREEN })}>
						<Right>
							{unreadCount > 0 ? (
								<NotificationOnSvg
									style={styles.shadow}
									width={moderateScale(50)}
									height={moderateScale(50)}
								/>
							) : (
								<NotificationSvg
									style={styles.shadow}
									width={moderateScale(50)}
									height={moderateScale(50)}
								/>
							)}
						</Right>
					</MainPress>
				)}
			</Wrapper>
		</>
	)
}

const styles = StyleSheet.create({
	text: {
		color: theme.colors.text,
	},
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(1),
		},
		shadowOpacity: moderateScale(0.15),
		shadowRadius: moderateScale(1),
	},
})

export default memo(Header)
