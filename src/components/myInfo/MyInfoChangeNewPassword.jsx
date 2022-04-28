import { PATCH_CHANGE_NEW_PASSWORD } from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { passwordJoinValidator } from '@/utils/validator'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { moderateScale, verticalScale } from '@theme/scaling'
import React, { useCallback, useRef, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import styled from 'styled-components/native'
import TextInput from '../ui/input/TextInput'
import Loading from '../ui/Loading'
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

export default function MyInfoChangeNewPassword() {
	const { SETTING_MAIN_SCREEN } = constants
	const { reset } = useNavigation()
	const { state, dispatch: userDispatch } = useUserContext()

	const { loading } = state.changeNewPassword
	const [newPassword, setNewPassword] = useState({ value: '', error: '' })
	const passwdRef = useRef()
	const { $alert, closeAlert } = useAlert()
	const [visiblePasswd, setVisiblePasswd] = useState(true)

	useFocusEffect(
		useCallback(() => {
			setNewPassword({ value: '', error: '' })
		}, []),
	)

	//새로운 비밀번호로 수정하기
	async function handleChangeNewPassword() {
		if (validationCheck()) {
			//api 호출
			if (newPassword.value) {
				if (validationCheck()) {
					try {
						const response = await PATCH_CHANGE_NEW_PASSWORD(userDispatch, {
							newPasswd: newPassword.value,
						})
						const resData = response.data

						if (resData.data === true) {
							$alert('변경이 완료 되었습니다.')
							//처음 화면의로

							setTimeout(() => {
								closeAlert()
								reset({ routes: [{ name: SETTING_MAIN_SCREEN }] })
							}, 1000)
						}
					} catch (error) {
						console.log(' error => ', error)
					}
				}
			}
		}
	}
	function validationCheck() {
		const newPasswordError = passwordJoinValidator(newPassword.value)

		if (newPasswordError) {
			setNewPassword({ ...newPassword, error: newPasswordError })
			return false
		}
		return true
	}
	return (
		<>
			{loading && <Loading />}
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
						<SmallText style={styles.textView}>새 비밀번호</SmallText>
						<TextInput
							type={'password'}
							value={newPassword.value}
							placeholder={'새 비밀번호를 입력하세요'}
							onChangeText={(text) => setNewPassword({ value: text, error: '' })}
							secureTextEntry={visiblePasswd}
							setVisible={() => setVisiblePasswd(!visiblePasswd)}
							isShadow={false}
							setRemoveText={() => setNewPassword({ value: '', error: '' })}
							errorText={newPassword.error}
							style={{
								...styles.textInput,
								marginBottom: newPassword.error ? verticalScale(38) : 0,
							}}
							inputStyle={styles.inputViewEditable}
							returnKeyType="done"
							onSubmitEditing={() => handleChangeNewPassword()}
							childRef={passwdRef}
						/>
					</Container>
				</TouchableWithoutFeedback>

				<Footer>
					<ConfirmButton
						onPress={() => handleChangeNewPassword()}
						style={{
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
