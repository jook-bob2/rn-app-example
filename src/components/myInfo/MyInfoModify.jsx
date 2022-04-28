import storageConst from '@/constants/storageConst'
import userConst from '@/constants/userConst'
import {
	GET_USER_INFO_RESPONSE,
	PATCH_WITHDRAWAL,
	POST_USER_SIGN_OUT,
	PUT_USER_INFO_MODIFY,
} from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { storageUtil } from '@/utils/storageUtil'
import { detailAddrValidator } from '@/utils/validator'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import { ArrowNextSvg, CancelSvg } from '@util/svgUtil'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
	Dimensions,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput as TextInputNative,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import styled from 'styled-components/native'
import AddressInput from '../ui/input/AddressInput'
import Loading from '../ui/Loading'
import Paragraph from '../ui/text/Paragraph'
import SmallText from '../ui/text/SmallText'
import Subtitle from '../ui/text/Subtitle'
import Left from '../ui/view/Left'
import Right from '../ui/view/Right'
import Row from '../ui/view/Row'

const {
	ADDRESS_FIND_SCREEN,
	SETTING_MAIN_SCREEN,
	MAIN_SCREEN,
	PERSON_MODIFY_NICE_CERT_WEBVIEW_SCREEN,
	CORP_MODIFY_NICE_CERT_WEBVIEW_SCREEN,
	MAIN_TAB_FLOW,
} = constants
const { CORP_PERSONAL_MODIFY, USER_PERSONAL_MODIFY } = userConst
const { USING_USER_LIST, USER_INFO } = storageConst

// const ScrollView = styled.ScrollView`
// 	background-color: ${theme.colors.background};
// `
const Container = styled.View`
	width: 100%;
	background-color: ${theme.colors.background};
	padding: ${moderateScale(24)}px;
`

const ItemView = styled.View`
	width: 100%;
	padding: ${verticalScale(13)}px ${horizontalScale(16)}px;
	border-width: ${verticalScale(1)}px;
	border-color: ${theme.colors.background};
	border-radius: ${moderateScale(5)}px;
	margin-bottom: ${verticalScale(8)}px;
	background-color: ${theme.colors.white};
`
const Pressable = styled.Pressable`
	justify-content: space-between;
	flex-direction: row;
	align-items: center;
`
const SignInBtnView = styled.View`
	justify-content: flex-end;
	align-items: center;
`
const ConfirmButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 90%;
	height: ${verticalScale(50)}px;
	background-color: ${theme.colors.turquoise};
	border-color: ${theme.colors.white};
	border-radius: ${moderateScale(8)}px;
	border-width: ${moderateScale(1)}px;
	flex-direction: row;
	bottom: ${verticalScale(13)}px;
`
const Line = styled.View`
	padding: ${moderateScale(10)}px;
`

const ConfirmView = styled.View`
	/* padding-top: ${verticalScale(10)}px; */
	justify-content: center;
	align-items: center;
`

const ConfirmTitleView = styled.View`
	padding-bottom: ${verticalScale(10)}px;
`
const UnEditView = styled.View`
	height: ${moderateScale(51)}px;
	border-radius: ${moderateScale(5)}px;
	margin-bottom: ${verticalScale(12)}px;
	background-color: ${theme.colors.white};
	justify-content: center;
`
const AddrView = styled.View`
	flex-direction: row;
	background-color: ${theme.colors.white};
	width: 100%;
	border-radius: ${moderateScale(5)}px;
	justify-content: space-between;
	height: ${verticalScale(50)}px;
`
const winHeight = Dimensions.get('window').height
const addrHeight = winHeight * 0.18

export default function MyInfoModify() {
	const { navigate, goBack } = useNavigation()
	const { userState: currentUser, onLogoutSuccess, onLoginSuccess } = useUser()
	const { state: userState, dispatch: userDispatch } = useUserContext()
	const { loading: signOutLoading } = userState.userSignOut
	const { loading: withdrawalLoading } = userState.withdrawal
	const { loading: modifyLoading } = userState.userInfoModify
	const { params } = useRoute()
	const scrollRef = useRef()
	const [isKeyboardShow, setIsKeyboardShow] = useState(false)
	const { $confirm } = useConfirm()
	const { $alert, closeAlert } = useAlert()
	const { state: userInfoState, dispatch: userInfoDispatch } = useUserContext()
	const { loading: userInfoLoading } = userInfoState.userInfoResponse
	// const [statusBarHeight, setStatusBarHeight] = useState(0)

	// useEffect(()=>{
	//     Platform.OS == 'ios' ? StatusBarManager.getHeight((statusBarFrameData) => {
	//         setStatusBarHeight(statusBarFrameData.height)
	//       }) : null
	// }, []);

	//const [verifyFlag, setVerifyFlag] = useState(true)

	//이메일 인증 땜에 verifyFlags넣음
	const [personalData, setPersonalData] = useState({
		email: '',
		name: '',
		hp: '',
		addr1: '',
		addr2: '',
		zipCode: '',
		userTypeCd: '',
	})

	useFocusEffect(
		useCallback(() => {
			if (!params?.personalData) {
				getMyInfo()
			} else {
				setPersonalData({ ...params?.personalData })
			}
		}, [currentUser.id]),
	)
	useEffect(() => {
		const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
			setIsKeyboardShow(true)
		})
		const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			setIsKeyboardShow(false)
		})

		return () => {
			showSubscription.remove()
			hideSubscription.remove()
		}
	}, [])

	async function getMyInfo() {
		if (currentUser.id) {
			try {
				const response = await GET_USER_INFO_RESPONSE(userInfoDispatch)
				const resData = response.data
				if (resData?.code === 'SUCCESS' && resData?.data) {
					setPersonalData(resData.data)
				}
			} catch (error) {
				console.log('error => ', error)
			}
		}
	}

	function findAddress() {
		//주소 api불러서 여기에 데이터 입력
		navigate(ADDRESS_FIND_SCREEN, { personalData: personalData })
	}
	function handleChangePhone() {
		const usertype = personalData.userTypeCd + '_HP_REAUTH'

		if (usertype === USER_PERSONAL_MODIFY) {
			navigate(PERSON_MODIFY_NICE_CERT_WEBVIEW_SCREEN, { personalData: personalData })
		} else if (usertype === CORP_PERSONAL_MODIFY) {
			navigate(CORP_MODIFY_NICE_CERT_WEBVIEW_SCREEN, { personalData: personalData })
		}
	}

	// function handleAddrFocus() {

	// }

	/*
	 * 로그아웃
	 */
	async function handlePressSignOut() {
		try {
			const r1 = await storageUtil.getItem({ key: USING_USER_LIST })
			const userList = r1?.data

			if (userList?.length > 0) {
				for (let i = 0; i < userList.length; i++) {
					try {
						let accessToken = userList[i].accessToken
						let refreshToken = userList[i].refreshToken

						if (accessToken && refreshToken) {
							const response = await POST_USER_SIGN_OUT(userDispatch, {
								accessToken: accessToken,
								refreshToken: refreshToken,
							})
							const resData = response.data

							if (resData?.code === 'SUCCESS' && resData?.data === true) {
								if (i === userList.length - 1) {
									const isSuccess = await onLogoutSuccess()
									if (isSuccess) {
										navigate(MAIN_TAB_FLOW, { screen: MAIN_SCREEN })
									}
								}
							} else if (resData?.code !== 'SUCCESS') {
								$alert(resData?.msg)
							}
						} else {
							$alert('로그아웃 중 오류가 발생했습니다.')
						}
					} catch (e2) {
						console.log('logout error => ', e2)
					}
				}
			}
		} catch (e1) {
			console.log('user list error => ', e1)
		}
	}

	/*
	 * 회원탈퇴
	 */
	async function handlePressWithdrawal() {
		$confirm({
			msg: () => {
				return (
					<ConfirmView>
						<ConfirmTitleView>
							<Subtitle
								style={{ color: theme.colors.text, fontFamily: theme.fonts.spoqaHanSansNeo.bold }}
							>
								정말 탈퇴하시겠습니까?
							</Subtitle>
						</ConfirmTitleView>
						<Row>
							<SmallText style={{ color: theme.colors.turquoise, fontSize: moderateScale(10) }}>
								{'차밥'}
							</SmallText>
							<SmallText style={{ fontSize: moderateScale(12) }}>
								{'에서 탈퇴하면 회원정보는 개인정보 보호방침에 따라'}
							</SmallText>
						</Row>
						<SmallText style={{ fontSize: moderateScale(12) }}>
							{'관리되며 사용하고 있는 모든 서비스의 해지 및 삭제 됩니다.'}
						</SmallText>
						<SmallText style={{ fontSize: moderateScale(12) }}>
							{'다시 복구할 수 없으며 서비스 이용이 불가합니다.'}
						</SmallText>
					</ConfirmView>
				)
			},
			cancelButtonName: '아니오',
			confirmButtonName: '예',
			onPress: async (result) => {
				if (result) {
					console.log('탈퇴')
					try {
						const response = await PATCH_WITHDRAWAL(userDispatch)
						const resData = response.data
						if (resData.code === 'SUCCESS' && resData.data === true) {
							handlePressSignOut()
						}
						if (resData.code !== 'SUCCESS' && resData.code === 'ESVC059') {
							$alert({
								msg: () => {
									return (
										<ConfirmView>
											<ConfirmTitleView>
												<Subtitle
													style={{
														color: theme.colors.text,
														fontFamily: theme.fonts.spoqaHanSansNeo.bold,
													}}
												>
													차밥을 탈퇴할 수 없습니다!
												</Subtitle>
											</ConfirmTitleView>
											<Row>
												<SmallText style={{ fontSize: moderateScale(12) }}>
													{'미납요금이 존재하기 때문에 탈퇴가 불가합니다.'}
												</SmallText>
											</Row>
											<SmallText style={{ fontSize: moderateScale(12) }}>
												{'미납금을 결제 후 다시 시도해주세요'}
											</SmallText>
										</ConfirmView>
									)
								},
							})
						} else {
							$alert(resData.msg)
						}
					} catch (error) {
						console.log('withdrawal error => ', error)
					}
				} else {
					console.log('취소')
				}
			},
		})
	}
	//회원수정
	// console.log(
	// 	'addr2:> ',
	// 	personalData.addr2.replace(
	// 		/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
	// 		'a',
	// 	),
	// )
	// console.log('addr2:> ', personalData.addr2)
	async function handleUserInfoModify() {
		// console.log('addr2:> ', personalData.addr2)
		try {
			const response = await PUT_USER_INFO_MODIFY(userDispatch, {
				email: personalData.email,
				name: personalData.name,
				hp: personalData.hp,
				addr1: personalData.addr1,
				addr2: personalData.addr2,
				zipCode: personalData.zipCode,
			})
			const resResult = response.data.data

			if (resResult === true) {
				$alert('수정되었습니다.')

				const { data } = await storageUtil.getItem({ key: USER_INFO })

				const isLogin = await onLoginSuccess({ ...data, name: personalData.name })

				if (isLogin) {
					setTimeout(() => {
						closeAlert()
						goBack(SETTING_MAIN_SCREEN)
					}, 1000)
				}
			} else {
				$alert('수정이 취소되었습니다.')
				setTimeout(() => {
					closeAlert()
					goBack(SETTING_MAIN_SCREEN)
				}, 1000)
			}
		} catch (error) {
			console.log('error => ', error)
		}
	}
	//수정 핸들
	function handleConfirmModify() {
		if (toastHandler()) {
			$confirm({
				msg: '정보를 수정 하시겠습니까?',
				cancelButtonName: '아니오',
				confirmButtonName: '예',
				onPress: (result) => {
					if (result) {
						handleUserInfoModify()
					}
				},
			})
		}
	}
	//Toast 핸들러
	function toastHandler() {
		const addrDetailError = detailAddrValidator(personalData.addr2)
		if (addrDetailError) {
			$alert(addrDetailError)
			return false
		}
		return true
	}
	return (
		<>
			{(signOutLoading || withdrawalLoading || userInfoLoading || modifyLoading) && <Loading />}
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={
					Platform.OS === 'ios'
						? verticalScale(verticalScale(getStatusBarHeight()) + verticalScale(83))
						: verticalScale(verticalScale(getStatusBarHeight()) + verticalScale(95))
				}
			>
				<ScrollView
					style={{ backgroundColor: theme.colors.background }}
					ref={scrollRef}
					keyboardShouldPersistTaps={'handle'}
				>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<Container>
							<SmallText style={styles.textView}>이름</SmallText>
							<UnEditView style={{ ...theme.shadow(0.2) }}>
								<SmallText style={styles.inputUnEdit}>{personalData.name}</SmallText>
							</UnEditView>

							<SmallText style={styles.textView}>핸드폰</SmallText>
							<AddressInput
								value={personalData.hp}
								buttonTitle={'재인증'}
								editable={false}
								inputStyle={styles.inputUnEdit}
								selectTextOnFocus={false}
								pressButton={() => handleChangePhone()}
								buttonStyle={styles.btnVerify}
								labelStyle={styles.labelVerify}
								style={{
									...theme.shadow(0.06),
									marginBottom: verticalScale(12),
								}}
							/>

							<SmallText style={styles.textView}>이메일</SmallText>
							<UnEditView style={{ ...theme.shadow(0.14) }}>
								<SmallText style={styles.inputUnEdit}>{personalData.email}</SmallText>
							</UnEditView>

							<SmallText style={styles.textView}>주소</SmallText>
							<AddressInput
								value={personalData.addr1}
								buttonTitle={'변경'}
								inputStyle={styles.inputUnEdit}
								pressButton={() => findAddress()}
								selectTextOnFocus={false}
								editable={false}
								buttonStyle={styles.btnAddr}
								labelStyle={styles.labelAddr}
								style={{
									...theme.shadow(0.06),
									marginBottom: verticalScale(8),
								}}
							/>
							<AddrView style={{ ...theme.shadow(0.11) }}>
								<Left>
									<TextInputNative
										value={personalData.addr2}
										onChangeText={(text) => setPersonalData({ ...personalData, addr2: text })}
										type={'text'}
										setRemoveText={() => setPersonalData({ ...personalData, addr2: '' })}
										// errorText={}
										style={{
											alignSelf: 'center',
											paddingLeft: moderateScale(16),
											fontSize: moderateScale(16),
											width: '90%',
											fontFamily: theme.fonts.spoqaHanSansNeo.regular,
										}}
										onPressIn={
											isKeyboardShow
												? scrollRef.current.scrollTo({
														x: 0,
														y: addrHeight,
														animated: true,
												  })
												: null
										}
										// onScroll={
										// 	(e) => console.log(e.nativeEvent.contentOffset.y())
										// 	// scrollRef.current.scrollTo({
										// 	// 	x: 0,
										// 	// 	y: 350,
										// 	// 	animated: true,
										// 	// })
										// }
									/>
								</Left>
								{personalData.addr2 ? (
									<Right
										style={{
											marginRight: horizontalScale(15),
											alignItems: 'center',
										}}
									>
										<TouchableOpacity
											onPress={() => setPersonalData({ ...personalData, addr2: '' })}
										>
											<CancelSvg width={moderateScale(18)} height={moderateScale(18)} />
										</TouchableOpacity>
									</Right>
								) : null}
							</AddrView>
							<Line />
							{currentUser.isLoggined && (
								<>
									<ItemView
										style={{
											...theme.shadow(0.11),
										}}
									>
										<Pressable onPress={() => handlePressSignOut()}>
											<Left>
												<Paragraph style={styles.itemText}>로그아웃</Paragraph>
											</Left>
											<Right>
												<ArrowNextSvg width={4} height={8} />
											</Right>
										</Pressable>
									</ItemView>

									<ItemView
										style={{
											...theme.shadow(0.11),
										}}
									>
										<Pressable onPress={() => handlePressWithdrawal()}>
											<Left>
												<Paragraph style={styles.itemText}>회원탈퇴</Paragraph>
											</Left>
											<Right>
												<ArrowNextSvg width={4} height={8} />
											</Right>
										</Pressable>
									</ItemView>
								</>
							)}
						</Container>
					</TouchableWithoutFeedback>
				</ScrollView>
				<SignInBtnView>
					<ConfirmButton onPress={() => handleConfirmModify()} style={styles.registerBtn}>
						<SmallText style={styles.buttonText}>수정완료</SmallText>
					</ConfirmButton>
				</SignInBtnView>
			</KeyboardAvoidingView>
		</>
	)
}

const styles = StyleSheet.create({
	button: {
		alignSelf: 'center',
		marginTop: verticalScale(40),
		position: 'absolute',
		bottom: verticalScale(30),
		opacity: 0.8,
	},

	textView: {
		marginTop: verticalScale(12),
		marginBottom: verticalScale(8),
		marginLeft: horizontalScale(10),
		fontSize: moderateScale(14),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		alignSelf: 'flex-start',
	},
	inputUnEdit: {
		backgroundColor: theme.colors.white,
		paddingLeft: moderateScale(16),
		fontSize: moderateScale(16),
		color: theme.colors.darkGray,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	btnVerify: {
		height: verticalScale(32),
		width: horizontalScale(68),
		borderRadius: 14,
		backgroundColor: theme.colors.white,
		borderColor: theme.colors.danger,
		borderWidth: 2,
	},
	labelVerify: {
		fontSize: 12,
		alignSelf: 'center',
		marginTop: verticalScale(7),
		color: theme.colors.danger,
		fontWeight: 'bold',
		fontFamily: theme.fonts.spoqaHanSansNeo.medium,
	},

	btnAddr: {
		height: verticalScale(32),
		width: horizontalScale(68),
		borderRadius: 14,
		backgroundColor: theme.colors.turquoise,
		borderColor: theme.colors.disabled,
	},
	labelAddr: {
		fontSize: 12,
		alignSelf: 'center',
		alignContent: 'center',
		marginTop: verticalScale(9),
		color: theme.colors.white,
		fontWeight: 'bold',
		fontFamily: theme.fonts.spoqaHanSansNeo.medium,
	},
	registerBtn: {
		alignSelf: 'center',
		backgroundColor: theme.colors.turquoise,
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
	},
	itemText: {
		color: theme.colors.text,
		fontSize: moderateScale(14),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	// inputTextUnEdit: {
	// 	backgroundColor: theme.colors.white,
	// 	paddingLeft: moderateScale(16),
	// 	fontSize: moderateScale(16),
	// 	color: theme.colors.darkGray,
	// 	fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	// },
})
