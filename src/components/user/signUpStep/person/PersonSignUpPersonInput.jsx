import EmailInput from '@/components/ui/input/EmailInput'
import TextInput from '@/components/ui/input/TextInput'
import Loading from '@/components/ui/Loading'
import SmallText from '@/components/ui/text/SmallText'
import { POST_CHECK_USER_EXIST, POST_EMAIL_CHECK } from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useError } from '@/core/store/common/providers/ErrorProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { emailValidator, passwordJoinValidator } from '@/utils/validator'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { useRoute } from '@react-navigation/native'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, Keyboard, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView'
import styled from 'styled-components/native'
const { PERSON_SIGN_UP_ADDR_SCREEN, SIGN_IN_SCREEN } = constants
const Container = styled.View`
	width: 100%;
	flex: 1;
	background-color: ${theme.colors.white};
`
const Wrap = styled.View`
	padding: ${moderateScale(24)}px;
	background-color: ${theme.colors.white};
`
const ProgessView = styled.View`
	width: 50%;
	height: ${verticalScale(3)}px;
	background-color: ${theme.colors.turquoise};
`
const Footer = styled.View`
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
	flex-direction: row;
	border-radius: ${moderateScale(8)}px;
	border-width: ${moderateScale(1)}px;
`

// const EmptyContents = styled.View`
// 	padding: ${verticalScale(10)}px ${horizontalScale(15)}px;
// `

// const MIN = 3
// const SEC = 0

const winHeight = Dimensions.get('window').height
const emailHeight = winHeight * 0.15
const passwordHeight = winHeight * 0.4

export default function PersonSignUpPersonInput() {
	const { navigate, reset } = useNavigation()
	const [email, setEmail] = useState({ value: '', error: '' })
	const { params } = useRoute()
	const [password, setPassword] = useState({ value: '', error: '' })
	const [name, setName] = useState()
	const [phonNumber, setPhoneNumber] = useState()
	const [birthdate, setBirthDate] = useState()
	const [userType, setUserType] = useState()
	// const [inputToken, setInputToken] = useState('')
	const [visiblePasswd, setVisiblePasswd] = useState(true)
	const scrollRef = useRef()
	const [gender, setGender] = useState()
	const [useMobileCo, setUseMobileCo] = useState('')
	const [useNationalInfo, setUseNationalInfo] = useState('')
	const { state: emailState, dispatch: emailCheck } = useUserContext()
	const { dispatch: userExistCheck } = useUserContext()

	const { loading: emailLoading } = emailState.emailCheck
	const [check, setCheck] = useState('N')
	const [isKeyboardShow, setIsKeyboardShow] = useState(false)
	//const [count, setCount] = useState(1)
	//const [countTime, setCountTime] = useState({ min: MIN, sec: SEC })
	//const time = useRef(180)
	const { $alert, closeAlert } = useAlert()
	//const timerId = useRef(null)
	const { $error } = useError()
	//const autoCloseTime = useRef(3)

	const [able, setAble] = useState({
		textAble: true,
		checkFlag: false,
		verifyText: false,
		//reSendFlag: false,
		//sendFlag: false,
		//showCount: false,
		clickFlag: false,
		//autoClose: false,
	})
	useEffect(() => {
		checkUser()
	}, [])
	useFocusEffect(
		useCallback(() => {
			const data = params.reponseData
			const birthDay = data.birthdate
			const mobileCo = data.mobileco
			const year = birthDay.substr(0, 4)
			const month = birthDay.substr(4, 2)
			const date = birthDay.substr(6, 2)
			setPhoneNumber(data.mobileno)
			setUserType(JSON.parse(data.receivedata).reqType)
			setName(data.name)
			setGender(data.gender)
			setBirthDate(year + '-' + month + '-' + date)
			const nationalInfo = data.nationalinfo

			if (nationalInfo === '0') {
				setUseNationalInfo('Y')
			} else {
				setUseNationalInfo('N')
			}

			if (mobileCo === '1') {
				setUseMobileCo('SKT')
			} else if (mobileCo === '2') {
				setUseMobileCo('KTF')
			} else if (mobileCo === '3') {
				setUseMobileCo('LGT')
			} else if (mobileCo === '5') {
				setUseMobileCo('SKR')
			} else if (mobileCo === '6') {
				setUseMobileCo('KTR')
			} else {
				setUseMobileCo('LGR')
			}
		}, [params.reponseData]),
	)
	const emailInput = useRef()
	const pwdInput = useRef()
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
	async function checkUser() {
		try {
			const response = await POST_CHECK_USER_EXIST(userExistCheck, {
				hp: params.reponseData.mobileno,
				userTypeCd: JSON.parse(params.reponseData.receivedata).reqType,
			})
			const resData = response.data
			console.log(resData)
			if (!resData.data) {
				$alert({
					msg: '이미등록된 회원 정보입니다.',
					onPress: () => {
						closeAlert()
						setTimeout(() => {
							closeAlert()
							reset({
								routes: [
									{
										name: SIGN_IN_SCREEN,
									},
								],
							})
						}, 500)
					},
				})
			}
			// $alert(resData.msg)
		} catch (error) {
			console.log('user check error :', error)
		}
	}
	function handlePressInformInput() {
		if (validationCheck()) {
			//다음으로 보낼 데이터
			const personalInfo = {
				email: email.value,
				passwd: password.value,
				name: name,
				birthdate: birthdate,
				userTypeCd: userType,
				gender: gender,
				mobileno: phonNumber,
				verifyFlag: check,
				alarmFlag: params.alarmFlag,
				hpCoCd: useMobileCo,
				frnrFlag: useNationalInfo,
				signUpAddrRequest: {
					addr1: '',
					addr2: '',
					zipcode: '',
				},
			}

			navigate(PERSON_SIGN_UP_ADDR_SCREEN, { personalInfos: personalInfo })
		}
	}

	// //이메일 인증 요청
	// async function handleSendEmail() {
	// 	//setCount(count + 1)
	// 	if (validationEmailCheck()) {
	// 		try {
	// 			const response = await POST_EMAIL_SEND(emailSend, {
	// 				email: email.value,
	// 				name: name,
	// 			})
	// 			const resData = response.data

	// 			// if (resData.code === 'SUCCESS') {
	// 			// 	$alert(`해당 이메일로 메일을 보냈습니다. 보낸 횟수 ${resData.data.sendCnt}/5`)
	// 			// 	setAble({
	// 			// 		...able,
	// 			// 		//sendFlag: true,
	// 			// 		textAble: false,
	// 			// 		//reSendFlag: false,
	// 			// 		//showCount: true,
	// 			// 		verifyText: true,
	// 			// 	})
	// 			// 	//	time.current = 180
	// 			// 	//	counteDown()
	// 			// } else if (resData.code === 'ESVC042') {
	// 			// 	//$alert(`${resData.msg} 24시간 잠금 처리 됩니다.`)
	// 			// 	//setCount(1)
	// 			// } else {
	// 			// 	$alert(resData.msg)
	// 			// }
	// 		} catch (error) {
	// 			console.log('send error : ', error)
	// 			const errData = error?.data
	// 			if (errData?.code) {
	// 				const { code, msg } = errData
	// 				setTimeout(() => {
	// 					$error({
	// 						code,
	// 						msg,
	// 						onPress: (result) => {
	// 							if (result) {
	// 								handleSendEmail()
	// 							}
	// 						},
	// 					})
	// 				}, 1000)
	// 			}
	// 		}
	// 	}
	// }

	// //이메일 인증 취소
	// function handleCancelEmail() {
	// 	if (able.showCount === true) {
	// 		setAble({ ...able, sendFlag: false, textAble: true, reSendFlag: false, verifyText: false })
	// 	} else {
	// 		setAble({ ...able, sendFlag: true, textAble: false, showCount: true, verifyText: true })
	// 		//counteDown()
	// 	}
	// 	clearInterval(timerId.current)
	// 	setCountTime({ min: MIN, sec: SEC })
	// 	time.current = 180
	// }

	function validationCheck() {
		const emailError = emailValidator(email.value)
		const passwordError = passwordJoinValidator(password.value)

		if (emailError) {
			setEmail({ ...email, error: emailError })
			setPassword({ ...password, error: passwordError })
			emailInput.current.focus()
			// console.log(emailInput)
			//emailInput.current
			scrollRef.current.scrollTo({ x: 0, y: emailHeight, animated: true })
			//	emailInput.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
			return false
		}
		if (passwordError) {
			setEmail({ ...email, error: emailError })
			setPassword({ ...password, error: passwordError })
			scrollRef.current.scrollTo({ x: 0, y: passwordHeight, animated: true })
			pwdInput.current.focus()
			return false
		}

		if (check === 'N') {
			$alert('이메일 중복을 확인해주세요.')
			scrollRef.current.scrollTo({ x: 0, y: emailHeight, animated: true })
			return false
		}
		return true
	}

	function validationEmailCheck() {
		const emailError = emailValidator(email.value)

		if (emailError) {
			setEmail({ ...email, error: emailError })

			return false
		}

		return true
	}

	// //시간 제한로직
	// function counteDown() {
	// 	timerId.current = setInterval(() => {
	// 		time.current -= 1
	// 		setCountTime({ min: parseInt(time.current / 60, 10), sec: parseInt(time.current % 60, 10) })

	// 		if (time.current === 0) {
	// 			clearInterval(timerId.current)
	// 			//dispatch event
	// 			authExpire()
	// 		}
	// 	}, 1000)
	// }

	//시간 만료 3분
	// function authExpire() {
	// 	setAble({
	// 		...able,
	// 		textAble: true,
	// 		reSendFlag: true,
	// 	})
	// 	clearInterval(timerId.current)
	// 	setCountTime({ min: MIN, sec: SEC })
	// 	time.current = 180
	// }

	//시간 만료 3초
	// function autoClose() {
	// 	setTimeout(() => {
	// 		setAble({ ...able, autoClose: false, showCount: false, clickFlag: true, checkFlag: true })
	// 	}, 3000)
	// }
	// //인증번호 체크
	async function handleCheckEmail() {
		if (validationEmailCheck()) {
			try {
				const response = await POST_EMAIL_CHECK(emailCheck, { email: email.value })
				const resData = response.data

				if (resData.data === true) {
					setAble({
						...able,
						//showCount: false,
						clickFlag: true,
						checkFlag: true,
						textAble: false,
						//autoClose: true,
					})
					setCheck('Y')
					//autoClose()
					// clearInterval(timerId.current)
					// setCountTime({ min: MIN, sec: SEC })
					// time.current = 180
					//autoCloseTime.current = 3
				}
				if (!resData.success) {
					$alert(resData.msg)
				}
			} catch (error) {
				console.log('email check error :', error)
				const errData = error?.data
				if (errData?.code) {
					const { code, msg } = errData
					setTimeout(() => {
						$error({
							code,
							msg,
							onPress: (result) => {
								if (result) {
									handleCheckEmail()
								}
							},
						})
					}, 1000)
				}
			}
			// setInputToken('')
		}
	}

	return (
		<>
			<ProgessView />
			{emailLoading && <Loading />}
			<Container>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					// style={{ flex: 1, backgroundColor: theme.colors.white }}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={Platform.OS === 'ios' ? winHeight * 0.2 : winHeight * 0.2}
				>
					<ScrollView ref={scrollRef} keyboardShouldPersistTaps={'handled'}>
						<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
							<Wrap>
								<SmallText style={styles.textView}>이름</SmallText>
								<TextInput
									value={name}
									isShadow={false}
									style={{
										marginBottom: verticalScale(18),
									}}
									editable={false}
									inputStyle={styles.inputView}
								/>
								<SmallText style={styles.textView}>휴대폰 번호</SmallText>
								<TextInput
									placeholder="휴대폰"
									value={phonNumber}
									isShadow={false}
									style={{
										marginBottom: verticalScale(18),
									}}
									editable={false}
									inputStyle={styles.inputView}
								/>
								<SmallText style={styles.textView}>생년월일</SmallText>
								<TextInput
									placeholder="생년월일"
									value={birthdate}
									isShadow={false}
									style={{
										marginBottom: verticalScale(18),
									}}
									editable={false}
									inputStyle={styles.inputView}
								/>
								<SmallText style={styles.textView}>아이디(이메일 주소)</SmallText>
								<EmailInput
									placeholder="아이디(이메일주소)를 입력하세요"
									value={email.value}
									emailValue={email.value}
									disabled={able.clickFlag}
									buttonTitle={!able.checkFlag && '중복확인'}
									// secondButtonTitle={
									// 	able.showCount ? (
									// 		<>
									// 			{countTime.min < 10 ? `0${countTime.min}` : countTime.min}:
									// 			{countTime.sec < 10 ? `0${countTime.sec}` : countTime.sec}
									// 			취소
									// 		</>
									// 	) : (
									// 		'인증완료'
									// 	)
									// }
									secondButtonTitle={
										able.checkFlag &&
										// 		<>
										// 			{countTime.min < 10 ? `0${countTime.min}` : countTime.min}:
										// 			{countTime.sec < 10 ? `0${countTime.sec}` : countTime.sec}
										// 			취소
										// 		</>
										// 	) : (
										'인증완료'
									}
									btnToggle={able.checkFlag}
									autoCapitalize="none"
									onChangeText={(text) => setEmail({ value: text, error: '' })}
									errorText={email.error}
									style={{
										...styles.lineInput,
										marginBottom: email.error ? verticalScale(33) : verticalScale(18),
									}}
									inputStyle={{
										...styles.emailInputStyle,
										backgroundColor: !able.textAble ? theme.colors.white : theme.colors.white,
									}}
									editable={able.textAble}
									checkFlag={able.checkFlag}
									returnKeyType="next"
									blurOnSubmit={false}
									autoFocus={true}
									onSubmitEditing={() => pwdInput.current.focus()}
									pressButton={() => handleCheckEmail()}
									childRef={emailInput}

									// cancelButton={() => handleCancelEmail()}
								/>

								{/* {able.verifyText && !able.checkFlag ? (
								<AddressInput
									placeholder="이메일 인증 번호"
									value={inputToken}
									onChangeText={(text) => setInputToken(text)}
									buttonTitle={'인증확인'}
									pressButton={() => handleCheckNumber()}
									style={{
										marginBottom: verticalScale(18),
									}}
									buttonStyle={styles.verifyBtn}
									labelStyle={styles.verifyNumber}
								/>
							) : undefined} */}

								<SmallText style={styles.textView}>비밀번호</SmallText>
								<TextInput
									placeholder="비밀번호를 입력하세요"
									secureTextEntry={visiblePasswd}
									value={password.value}
									isShadow={false}
									type={'password'}
									onChangeText={(text) => setPassword({ value: text, error: '' })}
									errorText={password.error}
									inputStyle={styles.inputViewEditable}
									style={{
										...styles.lineInput,
										marginBottom: password.error ? verticalScale(33) : verticalScale(18),
									}}
									setVisible={() => setVisiblePasswd(!visiblePasswd)}
									setRemoveText={() => setPassword({ value: '', error: '' })}
									returnKeyType="done"
									blurOnSubmit={false}
									onSubmitEditing={handlePressInformInput}
									childRef={pwdInput}
								/>
							</Wrap>
						</TouchableWithoutFeedback>
					</ScrollView>
					<Footer>
						<ConfirmButton
							onPress={handlePressInformInput}
							style={{
								marginBottom: !isKeyboardShow ? verticalScale(40) : 0,
								backgroundColor:
									email.value && password.value && check === 'Y'
										? theme.colors.turquoise
										: theme.colors.disabled,
							}}
						>
							<SmallText style={styles.buttonText}>다음</SmallText>
						</ConfirmButton>
					</Footer>
				</KeyboardAvoidingView>
			</Container>
		</>
	)
}
const styles = StyleSheet.create({
	inputView: {
		backgroundColor: theme.colors.background,
		borderRadius: moderateScale(5),
		fontSize: moderateScale(14),
		color: theme.colors.darkGray,
		paddingBottom: verticalScale(15),
		paddingLeft: moderateScale(10),
	},

	textView: {
		marginTop: verticalScale(12),
		marginBottom: verticalScale(8),
		marginLeft: horizontalScale(10),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		alignSelf: 'flex-start',
		fontSize: moderateScale(14),
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
	},
	lineInput: {
		borderBottomColor: theme.colors.line,
		borderBottomWidth: moderateScale(1),
	},
	inputViewEditable: {
		backgroundColor: theme.colors.white,
		color: theme.colors.darkGray,
		paddingLeft: moderateScale(10),
		width: 375,
	},
	emailInputStyle: {
		backgroundColor: theme.colors.white,
		paddingBottom: verticalScale(5),
		lineHeight: moderateScale(18),
		color: theme.colors.text,
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	verifyNumber: {
		color: theme.colors.white,
		fontSize: moderateScale(12),
	},
	verifyBtn: {
		backgroundColor: theme.colors.turquoise,
		borderRadius: moderateScale(22),
		width: moderateScale(80),
		alignItems: 'center',
		justifyContent: 'center',
		height: moderateScale(32),
	},
})
