import TextInput from '@/components/ui/input/TextInput'
import { PATCH_USER_CHANGE_PASSWORD, POST_USER_CHECK } from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { passwordJoinValidator } from '@/utils/validator'
import { useNavigation, useRoute } from '@react-navigation/native'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import styled from 'styled-components/native'
import SmallText from '../ui/text/SmallText'

const { FIND_PASSWORD_BY_EMAIL_SCREEN, SIGN_IN_SCREEN } = constants

const Container = styled.View`
	flex: 1;
	width: 100%;
	padding: ${moderateScale(34)}px;
	background-color: ${theme.colors.white};
`
const Footer = styled.View`
	justify-content: flex-end;
	align-items: center;
`
const ConfirmButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 90%;
	height: ${verticalScale(55)}px;
	background-color: ${theme.colors.turquoise};
	border-color: ${theme.colors.white};
	border-width: ${moderateScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	flex-direction: row;
`

export default function UserFindPassword() {
	const [newPassword, setNewPassword] = useState({ value: '', error: '' })
	const { $confirm } = useConfirm()
	const passwdRef = useRef()
	const { params } = useRoute()
	const { goBack, reset } = useNavigation()
	const { $alert } = useAlert()
	const [visiblePasswd, setVisiblePasswd] = useState(true)
	const [isKeyboardShow, setIsKeyboardShow] = useState(false)
	const { dispatch: userDispatch } = useUserContext()
	const { dispatch: userChange } = useUserContext()

	useEffect(() => {
		checkUser()
	}, [])

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
			const response = await POST_USER_CHECK(userDispatch, {
				email: params.findPasswd.email,
				hp: params.findPasswd.hp,
				name: params.findPasswd.name,
				birthdate: params.findPasswd.birthdate,
			})
			const resData = response.data

			if (resData.data === false) {
				$confirm({
					msg: '회원 정보와 이메일이 맞지 않습니다.\n\n 이메일을 다시 확인하세요',
					// confirmButtonName: '확인',
					onPress: () => {
						goBack(FIND_PASSWORD_BY_EMAIL_SCREEN)
					},
				})
			}
		} catch (error) {
			console.log(' error => ', error)
		}
	}
	// console.log(' params=> ', params)
	async function handlePressChangePassword() {
		if (validationCheck()) {
			try {
				const response = await PATCH_USER_CHANGE_PASSWORD(userChange, {
					newPasswd: newPassword.value,
					email: params.findPasswd.email,
					hp: params.findPasswd.hp,
				})
				const resData = response.data

				if (resData.data === true) {
					$confirm({
						msg: '비밀번호 변경완료',
						// confirmButtonName: '확인',
						onPress: () => {
							// goBack(FIND_PASSWORD_BY_EMAIL_SCREEN)
							reset({ routes: [{ name: SIGN_IN_SCREEN }] })
						},
					})
					//navigate(SIGN_IN_SCREEN)
				} else if (resData.code === 'ESVC002') {
					$alert(resData.msg)
				} else {
					$alert(resData.data)
				}
			} catch (error) {
				console.log(' error => ', error)
			}
		}
	}
	function validationCheck() {
		const passwordError = passwordJoinValidator(newPassword.value)

		if (passwordError) {
			setNewPassword({ ...newPassword, error: passwordError })
			return false
		}
		return true
	}

	return (
		<>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={
					Platform.OS === 'ios'
						? verticalScale(verticalScale(getStatusBarHeight()) + verticalScale(70))
						: verticalScale(verticalScale(getStatusBarHeight()) + verticalScale(60))
				}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<Container>
						<Text style={styles.textView}>새비밀번호</Text>

						<TextInput
							placeholder="새 비밀번호를 입력하세요"
							value={newPassword.value}
							type={'password'}
							isShadow={false}
							secureTextEntry={visiblePasswd}
							autoFocus={true}
							inputStyle={styles.inputViewEditable}
							onChangeText={(text) => setNewPassword({ value: text, error: '' })}
							errorText={newPassword.error}
							style={{
								...styles.textInput,
								marginBottom: newPassword.error ? verticalScale(38) : verticalScale(16),
							}}
							setRemoveText={() => setNewPassword({ value: '', error: '' })}
							setVisible={() => setVisiblePasswd(!visiblePasswd)}
							returnKeyType="done"
							onSubmitEditing={() => handlePressChangePassword()}
							childRef={passwdRef}
						/>
					</Container>
				</TouchableWithoutFeedback>
				<Footer>
					<ConfirmButton
						onPress={() => handlePressChangePassword()}
						style={{
							marginBottom: !isKeyboardShow ? verticalScale(40) : 0,
							backgroundColor: newPassword.value ? theme.colors.turquoise : theme.colors.disabled,
						}}
					>
						<SmallText style={styles.buttonText}>변경하기</SmallText>
					</ConfirmButton>
				</Footer>
			</KeyboardAvoidingView>
		</>
	)
}

const styles = StyleSheet.create({
	button: {
		marginTop: 24,
		maxWidth: 200,
	},
	textInput: {
		borderBottomColor: theme.colors.line,
		borderBottomWidth: moderateScale(1),
	},
	inputViewEditable: {
		backgroundColor: theme.colors.white,
		borderRadius: moderateScale(5),
		paddingBottom: verticalScale(5),
		lineHeight: moderateScale(20),
		color: theme.colors.text,
		paddingLeft: moderateScale(0),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		fontSize: moderateScale(14),
	},
	imageView: {
		flex: 1,
		marginTop: verticalScale(18),
		marginRight: horizontalScale(15),
		alignSelf: 'flex-start',
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
	},
	textView: {
		fontSize: moderateScale(12),
		color: theme.colors.text,
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	inputView: {
		flex: 5,
	},
})
