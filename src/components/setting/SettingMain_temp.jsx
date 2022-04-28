// import React, { useCallback, useState } from 'react'
// import { StyleSheet, TouchableOpacity } from 'react-native'
// import SmallText from '../ui/text/SmallText'
// import constants from '@/navigations/constants'
// import { useFocusEffect, useNavigation } from '@react-navigation/core'
// import { POST_USER_SIGN_OUT } from '@core/store/api/create/userCreate'
// import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
// import { useUser } from '@/core/store/common/providers/UserProvider'
// import Loading from '../ui/Loading'
// import styled from 'styled-components/native'
// import { theme } from '@/theme'
// import Left from '../ui/view/Left'
// import Paragraph from '../ui/text/Paragraph'
// import Right from '../ui/view/Right'
// import Row from '../ui/view/Row'
// import Switch from '../ui/Switch'
// import { getExpireTime } from '@/core/api/userApi'
// import VersionInfo from 'react-native-version-info'
// import SettingPermissionModal from './main/SettingPermissionModal'
// import { checkNotifications } from 'react-native-permissions'
// import { moderateScale, verticalScale, horizontalScale } from '@theme/scaling'
// import { storageUtil } from '@/utils/storageUtil'
// import storageConst from '@/constants/storageConst'

// const { MY_CHABAP_TAB_FLOW, TERMS_USE_SCREEN, PRIVACY_NOTICE_SCREEN, AUTH_STACK_FLOW, SIGN_IN_SCREEN } = constants
// const { AUTO_SIGN } = storageConst

// const Container = styled.ScrollView`
// 	flex: 1;
// 	padding: ${moderateScale(20)}px;
// `

// const Contents = styled.View`
// 	flex: 1;
// 	justify-content: center;
// 	align-items: center;
// `

// const SwitchView = styled.View`
// 	width: 100%;
// 	flex-direction: row;
// 	justify-content: space-between;
// 	align-items: center;
// 	padding: ${verticalScale(12)}px ${horizontalScale(21)}px;
// 	border-width: ${verticalScale(1)}px;
// 	border-color: ${theme.colors.disabled};
// 	border-radius: ${moderateScale(18)}px;
// `

// const ItemView = styled.View`
// 	width: 100%;
// 	/* flex-direction: row;
// 	justify-content: space-between;
// 	align-items: center; */
// 	padding: ${verticalScale(12)}px ${horizontalScale(21)}px;
// 	border-width: ${verticalScale(1)}px;
// 	border-color: ${theme.colors.disabled};
// 	border-radius: ${moderateScale(18)}px;
// `

// const VersionView = styled.View`
// 	width: 100%;
// 	flex-direction: row;
// 	justify-content: space-between;
// 	align-items: center;
// 	padding: ${verticalScale(12)}px ${horizontalScale(21)}px;
// 	border-width: ${verticalScale(1)}px;
// 	border-color: ${theme.colors.disabled};
// 	border-radius: ${moderateScale(18)}px;
// `

// const Footer = styled.View`
// 	flex-direction: column;
// 	padding: ${verticalScale(10)}px 0px;
// `

// const LinkView = styled.View`
// 	border-bottom-width: 1px;
// 	border-bottom-color: ${theme.colors.darkGray};
// `

// const Image = styled.Image`
// 	width: ${moderateScale(18)}px;
// 	height: ${moderateScale(18)}px;
// `

// const Pressable = styled.Pressable`
// 	flex-direction: row;
// 	justify-content: space-between;
// 	align-items: center;
// `

// export default function SettingMain() {
// 	const { navigate } = useNavigation()
// 	const { state: userState, dispatch: userDispatch } = useUserContext()
// 	const { loading: signOutLoading } = userState.userSignOut
// 	const { onLogoutSuccess, userState: currentUser, onLoginSuccess, removeRefresh } = useUser()
// 	const [isPhonePush, setIsPhonePush] = useState(false)
// 	const [isEventPush, setIsEventPush] = useState(false)
// 	const [isPermissionOpen, setIsPermissionOpen] = useState(false)

// 	// useFocusEffect(
// 	// 	useCallback(() => {
// 	// 		setIsAutoSign(currentUser.autoSign)
// 	// 	}, [currentUser.autoSign]),
// 	// )

// 	useFocusEffect(
// 		useCallback(() => {
// 			checkNotifications().then(({ status, settings }) => {
// 				console.log(status, settings)
// 			})
// 		}, []),
// 	)

// 	/*
// 	 * 자동 로그인 스위칭
// 	 */
// 	async function onToggleAutoSign(value) {
// 		const saveData = { ...currentUser, autoSign: value }
// 		if (value === false) removeRefresh()
// 		// 재로그인 시킴
// 		onLoginSuccess(saveData)

// 		// 재로그인 시 자동로그인인지 확인용
// 		await storageUtil.setItem({ key: AUTO_SIGN, value, options: { addYear: 1 } })
// 	}

// 	/*
// 	 * 핸드폰 푸시 알림 스위칭
// 	 */
// 	function onTogglePhonePush(value) {
// 		console.log('phone push value => ', value)
// 		setIsPhonePush(value)
// 	}

// 	/*
// 	 * 이벤트/푸시 알림 스위칭
// 	 */
// 	function onToggleEventPush(value) {
// 		console.log('event push value => ', value)
// 		setIsEventPush(value)
// 	}

// 	/*
// 	 * 로그아웃
// 	 */
// 	async function handlePressSignOut() {
// 		try {
// 			const response = await POST_USER_SIGN_OUT(userDispatch)
// 			if (response.data.data === 1) {
// 				onLogoutSuccess()
// 				navigate(AUTH_STACK_FLOW, { screen: SIGN_IN_SCREEN })
// 			}
// 		} catch (error) {
// 			console.log('logout error => ', error)
// 		}
// 	}

// 	async function handlePressTest() {
// 		try {
// 			const response = await getExpireTime()
// 			console.log('test response => ', response)
// 		} catch (error) {
// 			console.log('test error => ', error)
// 		}
// 	}

// 	return (
// 		<>
// 			{signOutLoading && <Loading />}
// 			<Container>
// 				<Contents>
// 					<SwitchView style={styles.bottom}>
// 						<Left>
// 							<Paragraph style={styles.itemText}>자동 로그인</Paragraph>
// 						</Left>
// 						<Right>
// 							<Switch
// 								isSwitchOn={currentUser.autoSign}
// 								onSelectSwitch={onToggleAutoSign}
// 								selectionColor={theme.colors.turquoise}
// 								disabledColor={theme.colors.disabled}
// 							/>
// 						</Right>
// 					</SwitchView>
// 					<SwitchView style={styles.bottom}>
// 						<Left>
// 							<Paragraph style={styles.itemText}>핸드폰 푸시알림</Paragraph>
// 						</Left>
// 						<Right>
// 							<Switch
// 								isSwitchOn={isPhonePush}
// 								onSelectSwitch={onTogglePhonePush}
// 								selectionColor={theme.colors.turquoise}
// 								disabledColor={theme.colors.disabled}
// 							/>
// 						</Right>
// 					</SwitchView>
// 					<SwitchView style={styles.bottom}>
// 						<Left>
// 							<Paragraph style={styles.itemText}>이벤트/푸시 푸시알림</Paragraph>
// 						</Left>
// 						<Right>
// 							<Switch
// 								isSwitchOn={isEventPush}
// 								onSelectSwitch={onToggleEventPush}
// 								selectionColor={theme.colors.turquoise}
// 								disabledColor={theme.colors.disabled}
// 							/>
// 						</Right>
// 					</SwitchView>
// 					<ItemView style={styles.bottom}>
// 						<Pressable onPress={() => setIsPermissionOpen(true)}>
// 							<Left>
// 								<Paragraph style={styles.itemText}>개인정보 권한설정</Paragraph>
// 							</Left>
// 							<Right>
// 								<Image
// 									tintColor={theme.colors.darkGray}
// 									source={require('@assets/icons/arrow_next.png')}
// 								/>
// 							</Right>
// 						</Pressable>
// 					</ItemView>
// 					<ItemView style={styles.bottom}>
// 						<Pressable onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: TERMS_USE_SCREEN })}>
// 							<Left>
// 								<Paragraph style={styles.itemText}>이용정보</Paragraph>
// 							</Left>
// 							<Right>
// 								<Image
// 									tintColor={theme.colors.darkGray}
// 									source={require('@assets/icons/arrow_next.png')}
// 								/>
// 							</Right>
// 						</Pressable>
// 					</ItemView>
// 					<ItemView style={styles.bottom}>
// 						<Pressable onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: PRIVACY_NOTICE_SCREEN })}>
// 							<Left>
// 								<Paragraph style={styles.itemText}>개인정보 취급방침</Paragraph>
// 							</Left>
// 							<Right>
// 								<Image
// 									tintColor={theme.colors.darkGray}
// 									source={require('@assets/icons/arrow_next.png')}
// 								/>
// 							</Right>
// 						</Pressable>
// 					</ItemView>
// 					<VersionView>
// 						<Left>
// 							<Paragraph style={styles.itemText}>버전정보</Paragraph>
// 						</Left>
// 						<Right>
// 							<Paragraph style={styles.versionText}>{VersionInfo.appVersion}</Paragraph>
// 						</Right>
// 					</VersionView>
// 				</Contents>
// 				{currentUser.isLoggined && (
// 					<Footer>
// 						<Right style={styles.column}>
// 							<Row>
// 								<SmallText style={styles.footerText}>차밥을 더이상 안 줘도 된다면, </SmallText>
// 								<TouchableOpacity onPress={() => handlePressSignOut()}>
// 									<LinkView>
// 										<SmallText style={styles.footerText}>로그아웃</SmallText>
// 									</LinkView>
// 								</TouchableOpacity>
// 							</Row>
// 							<Row>
// 								<SmallText style={styles.footerText}>완전히 굶어도 된다면, </SmallText>
// 								<TouchableOpacity onPress={() => handlePressTest()}>
// 									<LinkView>
// 										<SmallText style={styles.footerText}>회원탈퇴</SmallText>
// 									</LinkView>
// 								</TouchableOpacity>
// 							</Row>
// 						</Right>
// 					</Footer>
// 				)}

// 				{isPermissionOpen && (
// 					<SettingPermissionModal
// 						isPermissionOpen={isPermissionOpen}
// 						setIsPermissionOpen={setIsPermissionOpen}
// 					/>
// 				)}
// 			</Container>
// 		</>
// 	)
// }

// const styles = StyleSheet.create({
// 	itemText: {
// 		color: theme.colors.darkGray,
// 	},
// 	footerText: {
// 		color: theme.colors.darkGray,
// 	},
// 	versionText: {
// 		color: theme.colors.turquoise,
// 	},
// 	column: {
// 		flexDirection: 'column',
// 	},
// 	bottom: {
// 		marginBottom: verticalScale(12),
// 	},
// })
