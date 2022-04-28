import TextInput from '@/components/ui/input/TextInput'
import Loading from '@/components/ui/Loading'
import SmallText from '@/components/ui/text/SmallText'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import { POST_USER_SIGN_UP } from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { useRoute } from '@react-navigation/native'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import { SearchSvg } from '@util/svgUtil'
import React, { useCallback, useEffect, useState } from 'react'
import {
	Dimensions,
	Keyboard,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native'
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView'
import styled from 'styled-components/native'

const { PERSON_SIGN_UP_CAR_INPUT_SCREEN, MAIN_TAB_FLOW, ADDRESS_FIND_SCREEN } = constants

const Container = styled.View`
	padding: ${verticalScale(34)}px;
	background-color: ${theme.colors.white};
`
const ProgessView = styled.View`
	width: 100%;
	height: ${verticalScale(3)}px;
	background-color: ${theme.colors.turquoise};
`
const SignInBtnView = styled.View`
	justify-content: flex-end;
	align-items: center;
	background-color: ${theme.colors.white};
`
const ConfirmButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 90%;
	height: ${verticalScale(50)}px;
	background-color: ${theme.colors.turquoise};
	border-color: ${theme.colors.white};
	flex-direction: row;
	border-radius: ${moderateScale(8)}px;
	border-width: ${moderateScale(1)}px;
`

const PressableView = styled.View`
	background-color: ${theme.colors.white};
	padding-bottom: ${verticalScale(5)}px;
	padding-left: ${moderateScale(10)}px;
	border-bottom-width: ${verticalScale(1)}px;
	border-bottom-color: ${theme.colors.line};
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`
const ConfirmView = styled.View`
	/* padding-top: ${verticalScale(20)}px; */
	justify-content: center;
	align-items: center;
`
const winHeight = Dimensions.get('window').height

export default function PersonSignUpAddr() {
	const { navigate, reset } = useNavigation()
	const { params } = useRoute()
	const { $confirm, closeConfirm } = useConfirm()
	const [loading, setLoading] = useState(false)
	const { $alert } = useAlert()
	const [personalReqData, setPersonalReqData] = useState({
		email: '',
		passwd: '',
		name: '',
		birthdate: '',
		userTypeCd: '',
		gender: '',
		mobileno: '',
		verifyFlag: '',
		alarmFlag: '',
		hpCoCd: '',
		frnrFlag: '',
		// smsFlag: '',
		// emailFlag: '',
		// pushFlag: '',
		signUpAddrRequest: { addr1: '', addr2: '', zipcode: '' },
	})
	const { dispatch: userDispatch } = useUserContext()
	const { onLoginSuccess, saveSignInHistory } = useUser()
	// const { loading: signUpLoading } = userState.userSignUp
	// const { loading: histLoading } = histState.signInHist
	const [isKeyboardShow, setIsKeyboardShow] = useState(false)

	useFocusEffect(
		useCallback(() => {
			setPersonalReqData({
				...personalReqData,
				...params?.personalInfos,
			})
		}, [params]),
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

	async function handleConfirmSignUp() {
		if (personalReqData.signUpAddrRequest.addr1 && personalReqData.signUpAddrRequest.addr2) {
			setLoading(true)
			try {
				const response = await POST_USER_SIGN_UP(userDispatch, {
					email: personalReqData.email,
					passwd: personalReqData.passwd,
					birthdate: personalReqData.birthdate,
					userTypeCd: personalReqData.userTypeCd,
					name: personalReqData.name,
					hp: personalReqData.mobileno,
					gender: personalReqData.gender,
					verifyFlag: personalReqData.verifyFlag,
					signUpAddrRequest: personalReqData.signUpAddrRequest,
					alarmSelectedRequest: personalReqData.alarmFlag,
					hpCoCd: personalReqData.hpCoCd,
					frnrFlag: personalReqData.frnrFlag,
				})
				const resData = response.data
				setLoading(false)
				if (resData.success && resData?.data?.accessToken) {
					const isLogin = await onLoginSuccess({ ...resData.data, autoSign: true })
					if (isLogin) {
						$confirm({
							msg: (
								<ConfirmView>
									<SmallText
										style={{
											color: theme.colors.text,
											fontFamily: theme.fonts.spoqaHanSansNeo.bold,
											marginBottom: horizontalScale(5),
										}}
									>
										회원가입이 완료되었습니다.
									</SmallText>
									<SmallText
										style={{
											color: theme.colors.text,
											fontFamily: theme.fonts.spoqaHanSansNeo.bold,
										}}
									>
										차량등록을 하시겠습니까?
									</SmallText>
								</ConfirmView>
							),
							cancelButtonName: '나중에',
							confirmButtonName: '등록',
							onPress: (r) => {
								//PERSON_SIGN_UP_CAR_INPUT_SCREEN userEmail: personalReqData.email
								if (r === true) {
									closeConfirm()
									setTimeout(() => {
										reset({
											routes: [
												{
													name: PERSON_SIGN_UP_CAR_INPUT_SCREEN,
												},
											],
										})
									}, 1000)
								} else {
									closeConfirm()
									setTimeout(() => {
										reset({ routes: [{ name: MAIN_TAB_FLOW }] })
									}, 1000)
								}
							},
						})

						// 로그인 후 로그인 히스토리 저장
						const histResult = await saveSignInHistory(resData.data.id)
						const { success, msg } = histResult
						if (!success) {
							setTimeout(() => {
								$alert(msg)
							}, 1000)
						}
					} else {
						console.log('====== 로그인 실패 =======')
					}
				} else if (resData.code === 'ESVC001') {
					setTimeout(() => {
						$alert(resData.msg)
					}, 1000)
				}
			} catch (error) {
				setLoading(false)
				console.log('signup error => ', error)
			}
		}
	}
	function findAddress() {
		navigate(ADDRESS_FIND_SCREEN, { personalInfo: personalReqData })
	}

	return (
		<>
			{loading && <Loading />}
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={Platform.OS === 'ios' ? winHeight * 0.2 : winHeight * 0.2}
				>
					<ScrollView
						keyboardShouldPersistTaps={'always'}
						// style={{ height: '93%', backgroundColor: theme.colors.white }}
					>
						<ProgessView />

						<Container>
							<SmallText style={styles.textView}>주소</SmallText>
							<TouchableOpacity onPress={() => findAddress()}>
								<PressableView>
									<Left>
										{!personalReqData.signUpAddrRequest.addr1 ? (
											<SmallText style={styles.inputViewEditableAddr}>
												도로명, 지번, 건물명 검색
											</SmallText>
										) : (
											<SmallText style={styles.inputViewAddr}>
												{personalReqData.signUpAddrRequest.addr1}
											</SmallText>
										)}
									</Left>
									<Right>
										<SearchSvg
											style={{ marginRight: horizontalScale(25) }}
											width={moderateScale(16)}
											height={moderateScale(16)}
										/>
									</Right>
								</PressableView>

								{/* <AddressInput
									placeholder="도로명, 지번, 건물명 검색"
									value={personalReqData.signUpAddrRequest.addr1}
									inputStyle={styles.inputViewEditableAddr}
									buttonTitle={
										<SearchSvg
											width={moderateScale(16)}
											height={moderateScale(16)}
										/>
									}
									buttonStyle={styles.searchBtn}
									pressButton={() => findAddress()}
									editable={false}
									selectTextOnFocus={false}
								/> */}
							</TouchableOpacity>
							<TextInput
								placeholder="상세주소를 입력하세요"
								placeholderTextColor={theme.colors.placeholder}
								type={'text'}
								value={personalReqData.signUpAddrRequest.addr2}
								isShadow={false}
								style={styles.textInput}
								inputStyle={styles.inputViewEditable}
								onChangeText={(text) =>
									setPersonalReqData({
										...personalReqData,
										signUpAddrRequest: {
											addr2: text,
											addr1: params?.personalInfos?.signUpAddrRequest?.addr1 || '',
											zipcode: params?.personalInfos?.signUpAddrRequest?.zipcode || '',
										},
									})
								}
								setRemoveText={() =>
									setPersonalReqData({
										...personalReqData,
										signUpAddrRequest: {
											addr2: '',
											addr1: params?.personalInfos?.signUpAddrRequest?.addr1 || '',
											zipcode: params?.personalInfos?.signUpAddrRequest?.zipcode || '',
										},
									})
								}
							/>

							<Text style={styles.addtext}>*등록한 주소 기준 맞춤 충전소를 추천해드립니다.</Text>
						</Container>
					</ScrollView>

					<SignInBtnView>
						<ConfirmButton
							onPress={() => handleConfirmSignUp()}
							style={{
								bottom: !isKeyboardShow ? verticalScale(40) : 0,
								backgroundColor:
									personalReqData.signUpAddrRequest.addr1 && personalReqData.signUpAddrRequest.addr2
										? theme.colors.turquoise
										: theme.colors.disabled,
							}}
						>
							<SmallText style={styles.buttonText}>회원가입</SmallText>
						</ConfirmButton>
					</SignInBtnView>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</>
	)
}
const styles = StyleSheet.create({
	textInput: {
		marginBottom: horizontalScale(10),
	},
	textView: {
		marginTop: verticalScale(12),
		marginLeft: horizontalScale(10),
		marginBottom: verticalScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		alignSelf: 'flex-start',
		fontSize: moderateScale(16),
	},

	left: {
		flex: 5,
	},
	right: {
		flex: 1,
		alignSelf: 'center',
		marginRight: 25,
	},

	addrButton: {
		width: '50%',
		height: 35,
		borderRadius: 25,
		backgroundColor: theme.colors.turquoise,
		borderColor: theme.colors.disabled,
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
	},
	addtext: {
		color: theme.colors.turquoise,
		alignSelf: 'flex-start',
		fontSize: moderateScale(13),
	},
	inputViewEditable: {
		backgroundColor: theme.colors.white,
		paddingBottom: verticalScale(5),
		paddingLeft: moderateScale(10),
		borderBottomWidth: verticalScale(1),
		borderBottomColor: theme.colors.line,
	},
	inputViewEditableAddr: {
		backgroundColor: theme.colors.white,
		color: theme.colors.placeholder,
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	inputViewAddr: {
		backgroundColor: theme.colors.white,
		color: theme.colors.text,
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	searchBtn: {
		marginRight: horizontalScale(15),
		marginTop: verticalScale(12),
	},
})
