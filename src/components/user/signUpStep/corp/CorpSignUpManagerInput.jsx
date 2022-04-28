import EmailInput from '@/components/ui/input/EmailInput'
import TextInput from '@/components/ui/input/TextInput'
import Loading from '@/components/ui/Loading'
import SmallText from '@/components/ui/text/SmallText'
import Row from '@/components/ui/view/Row'
import { POST_EMAIL_CHECK } from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useError } from '@/core/store/common/providers/ErrorProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { emailValidator, passwordJoinValidator } from '@/utils/validator'
import { useNavigation } from '@react-navigation/core'
import { useRoute } from '@react-navigation/native'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React, { useEffect, useRef, useState } from 'react'
import {
	Dimensions,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
} from 'react-native'
import styled from 'styled-components/native'

const { CORP_SIGN_UP_CORP_INPUT_SCREEN } = constants

const Container = styled.View`
	width: 100%;
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
// const EmptyContents = styled.View`
// 	padding: ${verticalScale(10)}px ${horizontalScale(15)}px;
// `

// const MIN = 3
// const SEC = 0

const winHeight = Dimensions.get('window').height
export default function CorpSignUpManagerInput() {
	const { navigate } = useNavigation()
	const [email, setEmail] = useState({ value: '', error: '' })
	const [password, setPassword] = useState({ value: '', error: '' })
	const [visiblePasswd, setVisiblePasswd] = useState(true)
	const { params } = useRoute()
	const [gender, setGender] = useState('')
	const [birthdate, setBirthDate] = useState('')
	// const [inputToken, setInputToken] = useState('')
	const [useMobileCo, setUseMobileCo] = useState('')
	const [useNationalInfo, setUseNationalInfo] = useState('')
	const [isKeyboardShow, setIsKeyboardShow] = useState(false)
	//const { dispatch: emailSend } = useUserContext()
	const { state: emailState, dispatch: emailCheck } = useUserContext()
	const { loading: emailLoading } = emailState.emailCheck
	const [check, setCheck] = useState('N')
	// const [count, setCount] = useState(1)
	const { $error } = useError()
	//const [countTime, setCountTime] = useState({ min: MIN, sec: SEC })
	// const time = useRef(180)
	const { $alert } = useAlert()
	//const timerId = useRef(null)
	// const autoCloseTime = useRef(3)

	const [able, setAble] = useState({
		textAble: true,
		checkFlag: false,
		verifyText: false,
		reSendFlag: false,
		sendFlag: false,
		showCount: false,
		clickFlag: false,
		//autoClose: false,
	})

	useEffect(() => {
		const birthDay = params.reponseData.birthdate

		const year = birthDay.substr(0, 4)
		const month = birthDay.substr(4, 2)
		const date = birthDay.substr(6, 2)
		setBirthDate(year + '-' + month + '-' + date)
		setGender(params.reponseData.gender)
		const nationalInfo = params?.reponseData.nationalinfo

		if (nationalInfo === '0') {
			setUseNationalInfo('N')
		} else {
			setUseNationalInfo('Y')
		}

		const mobileCo = params?.reponseData.mobileco
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
		} else if (mobileCo === '7') {
			setUseMobileCo('LGR')
		}
	}, [params.reponseData])

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
	const emailInput = useRef()
	const pwdInput = useRef()

	function handlePressInformInput() {
		if (validationCheck() && check === 'Y') {
			const data = params.reponseData
			const corpInfo = {
				userInfo: {
					email: email.value,
					passwd: password.value,
					gender: gender,
					hp: params.reponseData.mobileno,
					userTypeCd: JSON.parse(data.receivedata).reqType,
					name: params.reponseData.name,
					birthdate: birthdate,
					verifyFlag: check,
					hpCoCd: useMobileCo,
					frnrFlag: useNationalInfo,
				},
				alarmFlag: params.alarmFlag,
				companyName: '',
				bizRegNum: '',
				companyRepresentative: '',
				phone: params.reponseData.mobileno,
				bizType: '',
				bizItem: '',
				addr1: '',
				addr2: '',
			}
			navigate(CORP_SIGN_UP_CORP_INPUT_SCREEN, { companyInfos: corpInfo })
		}
	}

	function validationCheck() {
		const emailError = emailValidator(email.value)
		const passwordError = passwordJoinValidator(password.value)

		if (emailError) {
			setEmail({ ...email, error: emailError })
			emailInput.current.focus()
			setPassword({ ...password, error: passwordError })
			return false
		}
		if (passwordError) {
			setEmail({ ...email, error: emailError })
			setPassword({ ...password, error: passwordError })
			pwdInput.current.focus()
			return false
		}
		if (check === 'N') {
			$alert('이메일 중복을 확인해 주세요')
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

	// //이메일 인증 요청
	// async function handleSendEmail() {
	// 	setCount(count + 1)
	// 	if (validationEmailCheck()) {
	// 		try {
	// 			const response = await POST_EMAIL_SEND(emailSend, {
	// 				email: email.value,
	// 				name: params.reponseData.name,
	// 			})
	// 			const resData = response.data
	// 			console.log(resData)
	// 			if (resData.code === 'SUCCESS') {
	// 				$alert(`해당 이메일로 메일을 보냈습니다. 보낸 횟수 ${resData.data.sendCnt}/5`)
	// 				setAble({
	// 					...able,
	// 					sendFlag: true,
	// 					textAble: false,
	// 					reSendFlag: false,
	// 					showCount: true,
	// 					verifyText: true,
	// 				})
	// 				time.current = 180
	// 				counteDown()
	// 			} else if (resData.code === 'ESVC042') {
	// 				$alert(`${resData.msg} 24시간 잠금 처리 됩니다.`)
	// 				setCount(1)
	// 			}
	// 			if (resData.code === 'ESVC001') {
	// 				$alert(resData.msg)
	// 			}
	// 		} catch (error) {
	// 			console.log('send error : ', error)
	// 		}
	// 	}
	// }

	//이메일 인증 취소
	// function handleCancelEmail() {
	// 	if (able.showCount === true) {
	// 		setAble({ ...able, sendFlag: false, textAble: true, reSendFlag: false, verifyText: false })
	// 	} else {
	// 		setAble({ ...able, sendFlag: true, textAble: false, showCount: true, verifyText: true })
	// 		counteDown()
	// 	}
	// 	clearInterval(timerId.current)
	// 	setCountTime({ min: MIN, sec: SEC })
	// 	time.current = 180
	// }

	//시간 제한로직
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

				if (resData.data) {
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
				console.log('resData:', able.textAble)
				if (!resData.success) {
					if (resData.code === 'ESVC001') {
						$alert('잘못된 이메일 정보이거나,\n이미 가입된 이메일 정보입니다.')
					}
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
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={Platform.OS === 'ios' ? winHeight * 0.2 : winHeight * 0.2}
				>
					<ScrollView
						keyboardShouldPersistTaps={'always'}
						style={{ height: '93%', backgroundColor: theme.colors.white }}
					>
						<Container>
							<SmallText style={styles.textView}>아이디(이메일 주소)</SmallText>
							<EmailInput
								placeholder="아이디(이메일주소)를 입력하세요"
								value={email.value}
								placeholderTextColor={theme.colors.placeholder}
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
								secondButtonTitle={able.checkFlag && '인증완료'}
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
								btnView={styles.btnView}
								editable={able.textAble}
								checkFlag={able.checkFlag}
								returnKeyType="next"
								autoFocus={able.textAble}
								onSubmitEditing={() => pwdInput.current.focus()}
								pressButton={() => handleCheckEmail()}
								childRef={emailInput}
								// cancelButton={() => handleCancelEmail()}
							/>

							<SmallText style={styles.textView}>비밀번호</SmallText>
							<TextInput
								placeholder="비밀번호을 입력하세요"
								placeholderTextColor={theme.colors.placeholder}
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
								onSubmitEditing={handlePressInformInput}
								childRef={pwdInput}
							/>
							<Row style={styles.row} />
						</Container>
					</ScrollView>
					<Footer>
						<ConfirmButton
							onPress={handlePressInformInput}
							style={{
								bottom: !isKeyboardShow ? verticalScale(40) : 0,
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
			</TouchableWithoutFeedback>
		</>
	)
}
const styles = StyleSheet.create({
	// button: {
	// 	width: 336,
	// 	height: 51,
	// },
	row: {
		alignSelf: 'center',
		paddingTop: 7,
		paddingLeft: 200,
	},
	textInput: {
		maxWidth: 350,
	},
	imageView: {
		flex: 1,
		marginTop: verticalScale(18),
		alignSelf: 'flex-start',
		paddingLeft: 15,
	},
	imageViewTwo: {
		flex: 1,
		alignSelf: 'center',
	},
	inputViewStyle: {
		flex: 5,
	},
	inputView: {
		width: '100%',
		backgroundColor: '#D3D3D3',
		height: verticalScale(53),
		borderRadius: moderateScale(33),
	},
	lineInput: {
		borderBottomColor: theme.colors.line,
		borderBottomWidth: moderateScale(1),
	},
	inputViewEditable: {
		backgroundColor: theme.colors.white,
		borderRadius: moderateScale(5),
		paddingBottom: verticalScale(5),
		lineHeight: moderateScale(20),
		color: theme.colors.text,
		paddingLeft: moderateScale(10),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		fontSize: moderateScale(1),
	},
	emailInputStyle: {
		backgroundColor: theme.colors.white,
		paddingBottom: verticalScale(5),
		lineHeight: moderateScale(18),
		color: theme.colors.text,
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	textView: {
		marginTop: verticalScale(12),
		marginBottom: verticalScale(8),
		marginLeft: horizontalScale(10),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		alignSelf: 'flex-start',
		fontSize: moderateScale(16),
	},

	emptyContents: {
		backgroundColor: theme.colors.white,
		borderBottomWidth: horizontalScale(1),
		borderBottomColor: theme.colors.disabled,
		borderRadius: moderateScale(20),
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(5),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(4.65),
		elevation: 5,
		margin: moderateScale(7),
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
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
	btnView: {
		right: 6,
	},
})
