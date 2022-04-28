import Button from '@/components/ui/button/Button'
import TextInput from '@/components/ui/input/TextInput'
import Logo from '@/components/ui/Logo'
import SmallText from '@/components/ui/text/SmallText'
import Row from '@/components/ui/view/Row'
import storageConst from '@/constants/storageConst'
import { POST_USER_SIGN_IN } from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useConnector } from '@/core/store/common/providers/ConnectorStatusProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { storageUtil } from '@/utils/storageUtil'
import { emailValidator, passwordJoinValidator } from '@/utils/validator'
import { useNavigation } from '@react-navigation/core'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import styled from 'styled-components/native'
import Loading from '../ui/Loading'
import Paragraph from '../ui/text/Paragraph'

const { SIGN_UP_SELECTION_SCREEN, MAIN_TAB_FLOW, FIND_PASSWORD_BY_EMAIL_SCREEN, ID_VERIFIED_SCREEN } = constants
const { AUTO_SIGN, IS_BACK } = storageConst

const ScrollView = styled.ScrollView`
	background-color: ${theme.colors.white};
`

const Container = styled.View`
	${theme.common.flexCenterColumn};
`

const Header = styled.View`
	padding-top: 48px;
	justify-content: center;
	align-items: center;
`

const Contents = styled.View`
	width: 100%;
	align-items: center;
`

const FindBtn = styled.TouchableOpacity`
	border-bottom-width: ${horizontalScale(1)}px;
	border-bottom-color: ${theme.colors.text};
`

const SignUpLabel = styled.View`
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

const SignUpBtn = styled.TouchableOpacity``

const BtnArea = styled.View``

export default function UserSignIn() {
	const { navigate, reset, canGoBack, goBack } = useNavigation()
	const { state, dispatch: userDispatch } = useUserContext()
	const { loading: signLoading } = state.userSignIn
	const { onLoginSuccess, saveSignInHistory } = useUser()
	const [email, setEmail] = useState({ value: '', error: '' })
	const [password, setPassword] = useState({ value: '', error: '' })
	const [visiblePasswd, setVisiblePasswd] = useState(true)
	const [isKeyboardShow, setIsKeyboardShow] = useState(false)
	const passwdRef = useRef()
	const { $alert } = useAlert()
	const { getConnStatus } = useConnector()

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

	useEffect(() => {
		if (isKeyboardShow) {
			setEmail({ ...email, error: '' })
			setPassword({ ...password, error: '' })
		}
	}, [isKeyboardShow])

	/*
	 * 로그인
	 */
	async function handlePressLogin() {
		Keyboard.dismiss()

		if (validationCheck()) {
			try {
				const response = await POST_USER_SIGN_IN(userDispatch, { email: email.value, passwd: password.value })
				const autoSignData = await storageUtil.getItem({ key: AUTO_SIGN })
				const autoSign = autoSignData?.data
				if (response.data) {
					const resData = response.data
					// 로그인 API Call

					if (resData.success && resData?.data?.accessToken) {
						const isLogin = await onLoginSuccess({ ...resData.data, autoSign: autoSign ? autoSign : true })

						if (isLogin === true) {
							const backAvailable = await storageUtil.getItem({ key: IS_BACK })

							await storageUtil.setItem({
								key: IS_BACK,
								value: false,
								options: { addHours: 24 },
							})

							getConnStatus(true)

							backAvailable?.data === true && canGoBack()
								? goBack()
								: reset({ routes: [{ name: MAIN_TAB_FLOW }] })

							// 로그인 후 로그인 히스토리 저장
							const histResult = await saveSignInHistory(resData.data.id)
							const { success, msg } = histResult
							if (!success) {
								setTimeout(() => {
									$alert(msg)
								}, 1000)
							}
						}
					} else if (resData?.data === null) {
						setEmail({ ...email, error: '아이디(E-mail)또는 비밀번호가 일치하지 않습니다.' })
					} else if (resData?.data?.failCnt > 0) {
						setEmail({ ...email, error: '' })
						const failCnt = resData?.data?.failCnt
						if (failCnt === 5) {
							$alert(`로그인 시도를 ${failCnt}번 실패하여 15분간 잠금 처리됩니다.`)
						} else {
							$alert(`로그인 실패 횟수 ${failCnt}/5`)
						}
					} else if (resData.code) {
						setEmail({ ...email, error: resData.msg })
					}
				}
			} catch (error) {
				console.log('login error => ', error)
			}
		}
	}

	function validationCheck() {
		const emailError = emailValidator(email.value)
		const passwordError = passwordJoinValidator(password.value)

		if (emailError || passwordError) {
			setEmail({ ...email, error: emailError })
			setPassword({ ...password, error: passwordError })
			return false
		}

		return true
	}

	function handleChangeText(text, type) {
		if (type === 'email') {
			setEmail({ value: text, error: '' })
			if (password.error) {
				setPassword({ value: password.value, error: '' })
			}
		}

		if (type === 'password') {
			setPassword({ value: text, error: '' })
			if (email.error) {
				setEmail({ value: email.value, error: '' })
			}
		}
	}

	return (
		<>
			{signLoading && <Loading />}
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={
					Platform.OS === 'ios'
						? verticalScale(verticalScale(getStatusBarHeight()) + verticalScale(10))
						: verticalScale(verticalScale(getStatusBarHeight()) - verticalScale(40))
				}
			>
				<ScrollView
					nestedScrollEnabled={true}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					// nestedScrollEnabled={true}
					// keyboardDismissMode="on-drag"
					keyboardShouldPersistTaps="handled"
				>
					<Container style={{ paddingTop: isKeyboardShow ? verticalScale(20) : verticalScale(44) }}>
						<Header>
							<Pressable style={{ alignItems: 'center' }} onPress={() => navigate(MAIN_TAB_FLOW)}>
								<Logo
									width={moderateScale(80)}
									height={moderateScale(96)}
									source={require('@assets/images/logo_2.png')}
								/>
								<Paragraph
									style={{
										fontFamily: theme.fonts.spoqaHanSansNeo.bold,
										color: theme.colors.text,
										fontSize: moderateScale(24),
									}}
								>
									로그인
								</Paragraph>
							</Pressable>
						</Header>

						<Contents
							style={{
								paddingTop: isKeyboardShow ? verticalScale(5) : verticalScale(48),
							}}
						>
							<TextInput
								placeholder="아이디(이메일 주소)"
								type={'text'}
								value={email.value}
								autoCapitalize="none"
								onChangeText={(text) => handleChangeText(text, 'email')}
								errorText={email.error}
								isShadow={false}
								keyboardType={'email-address'}
								style={{
									...styles.textInput,
									marginBottom: email.error ? verticalScale(38) : verticalScale(16),
								}}
								setRemoveText={() => setEmail({ value: '', error: '' })}
								returnKeyType="next"
								blurOnSubmit={false}
								autoFocus={true}
								onSubmitEditing={() => passwdRef.current.focus()}
							/>

							<TextInput
								placeholder="비밀번호"
								type={'password'}
								secureTextEntry={visiblePasswd}
								value={password.value}
								isShadow={false}
								onChangeText={(text) => handleChangeText(text, 'password')}
								errorText={password.error}
								shadow={styles.shadow}
								style={{
									...styles.textInput,
									marginBottom: password.error ? verticalScale(38) : 0,
								}}
								setRemoveText={() => setPassword({ value: '', error: '' })}
								setVisible={() => setVisiblePasswd(!visiblePasswd)}
								returnKeyType="done"
								onSubmitEditing={() => handlePressLogin()}
								childRef={passwdRef}
							/>

							<BtnArea style={{ paddingTop: isKeyboardShow ? verticalScale(10) : verticalScale(30) }}>
								<Button
									onPress={() => handlePressLogin()}
									style={{
										backgroundColor:
											email.value && password.value
												? theme.colors.turquoise
												: theme.colors.disabled,
									}}
								>
									<SmallText style={{ ...styles.whiteText, fontSize: moderateScale(18) }}>
										로그인
									</SmallText>
								</Button>
							</BtnArea>
							<View style={{ paddingTop: isKeyboardShow ? verticalScale(10) : verticalScale(40) }} />
							<SignUpLabel style={{ paddingTop: isKeyboardShow ? verticalScale(0) : verticalScale(0) }}>
								<Row>
									<SmallText style={{ color: theme.colors.darkGray, ...styles.font14 }}>
										{'계정을 잊으셨나요?  '}
									</SmallText>
									<FindBtn onPress={() => navigate(ID_VERIFIED_SCREEN)}>
										<SmallText
											style={{ ...styles.font14, fontFamily: theme.fonts.spoqaHanSansNeo.bold }}
										>
											{'ID찾기'}
										</SmallText>
									</FindBtn>
									<SmallText style={{ color: theme.colors.darkGray, ...styles.font14 }}>
										{' 또는 '}
									</SmallText>
									<FindBtn onPress={() => navigate(FIND_PASSWORD_BY_EMAIL_SCREEN)}>
										<SmallText
											style={{ ...styles.font14, fontFamily: theme.fonts.spoqaHanSansNeo.bold }}
										>
											{'비밀번호 찾기'}
										</SmallText>
									</FindBtn>
								</Row>
								<View style={{ paddingTop: moderateScale(17) }} />
								<Row style={{ marginBottom: verticalScale(40) }}>
									<SmallText style={{ color: theme.colors.darkGray, ...styles.font14 }}>
										{'혹시 차밥 첫 끼이신가요?  '}
									</SmallText>
									<SignUpBtn onPress={() => navigate(SIGN_UP_SELECTION_SCREEN)}>
										<SmallText style={{ ...styles.joinText, ...styles.font14 }}>
											{'회원가입'}
										</SmallText>
									</SignUpBtn>
								</Row>
							</SignUpLabel>
						</Contents>
					</Container>
				</ScrollView>
			</KeyboardAvoidingView>
		</>
	)
}

const styles = StyleSheet.create({
	subtitle: {
		color: theme.colors.turquoise,
	},
	row: {
		alignSelf: 'center',
		paddingTop: verticalScale(20),
	},
	textInput: {
		maxWidth: moderateScale(336),
		borderBottomColor: theme.colors.line,
		borderBottomWidth: moderateScale(1),
		borderRadius: moderateScale(33),
	},
	joinText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		color: theme.colors.turquoise,
	},
	whiteText: {
		color: theme.colors.white,
	},
	font14: {
		fontSize: moderateScale(14),
	},
})
