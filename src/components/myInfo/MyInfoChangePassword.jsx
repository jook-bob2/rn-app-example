import { POST_ACCESS_CHANGE_PASSWORD } from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
//import { useFocusEffect } from '@react-navigation/native'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useBackColor } from '@/core/store/common/providers/BackColorProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { passwordValidator } from '@/utils/validator'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { moderateScale, verticalScale } from '@theme/scaling'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import styled from 'styled-components/native'
import TextInput from '../ui/input/TextInput'
import SmallText from '../ui/text/SmallText'

const Container = styled.View`
	flex: 1;
	background-color: ${theme.colors.white};
	padding: ${moderateScale(32)}px;
`
const Footer = styled.View`
	align-items: center;
	justify-content: flex-end;
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
	margin-bottom: ${verticalScale(40)}px;
`

export default function MyInfoChangePassword() {
	const { MY_INFO_CHANGE_NEW_PASSWORD_SCREEN } = constants
	const { navigate } = useNavigation()
	const { $alert } = useAlert()
	const { dispatch: userDispatch } = useUserContext()
	const [password, setPassword] = useState({ value: '', error: '' })

	const passwdRef = useRef()
	const [visiblePasswd, setVisiblePasswd] = useState(true)
	const { setBottomColor } = useBackColor()

	useFocusEffect(
		useCallback(() => {
			setPassword({ value: '', error: '' })
		}, []),
	)

	useEffect(() => {
		password.value ? setBottomColor(theme.colors.turquoise) : setBottomColor(theme.colors.disabled)
	}, [password])

	async function handlePressInformInput() {
		if (password.value) {
			if (validationCheck()) {
				try {
					const response = await POST_ACCESS_CHANGE_PASSWORD(userDispatch, {
						passwd: password.value,
					})
					const resData = response.data
					console.log('email', resData)
					if (resData.data === true) {
						//다음으로
						navigate(MY_INFO_CHANGE_NEW_PASSWORD_SCREEN)
					} else {
						$alert('번호가 틀렸습니다.')
					}
				} catch (error) {
					console.log(' error => ', error)
				}
			}
		}
	}
	function validationCheck() {
		const passwordError = passwordValidator(password.value)
		if (passwordError) {
			setPassword({ ...password, error: passwordError })
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
						: verticalScale(verticalScale(getStatusBarHeight()) + verticalScale(75))
				}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<Container>
						<SmallText style={styles.textView}>기존 비밀번호</SmallText>
						<TextInput
							placeholder="비밀번호을 입력하세요"
							secureTextEntry={visiblePasswd}
							value={password.value}
							type={'password'}
							isShadow={false}
							inputStyle={styles.inputViewEditable}
							onChangeText={(text) => setPassword({ value: text, error: '' })}
							errorText={password.error}
							style={{ ...styles.textInput, marginBottom: password.error ? verticalScale(38) : 0 }}
							setVisible={() => setVisiblePasswd(!visiblePasswd)}
							returnKeyType="done"
							setRemoveText={() => setPassword({ value: '', error: '' })}
							onSubmitEditing={() => handlePressInformInput()}
							childRef={passwdRef}
						/>
					</Container>
				</TouchableWithoutFeedback>

				<Footer>
					<ConfirmButton
						onPress={() => handlePressInformInput()}
						style={{
							backgroundColor: password.value ? theme.colors.turquoise : theme.colors.disabled,
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
	textView: {
		fontSize: moderateScale(13),
		color: theme.colors.text,
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
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
	button: {
		alignSelf: 'center',
		marginTop: verticalScale(40),
		bottom: verticalScale(30),
		opacity: 0.8,
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
	},
})
