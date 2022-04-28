import TextInput from '@/components/ui/input/TextInput'
import { POST_EMAIL_EXIST } from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { emailValidator } from '@/utils/validator'
import { useNavigation } from '@react-navigation/native'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React, { useRef, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import styled from 'styled-components/native'
import Loading from '../ui/Loading'
import SmallText from '../ui/text/SmallText'

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

export default function UserFindPasswdByEmail() {
	const [email, setEmail] = useState({ value: '', error: '' })
	const { $alert } = useAlert()
	const { navigate } = useNavigation()
	const { PWD_VERIFIED_SCREEN } = constants
	const { state, dispatch: userDispatch } = useUserContext()
	const { loading } = state.userEmailExist
	const enterRef = useRef()

	async function handlePressFindEmail() {
		if (validationCheck()) {
			if (email.value) {
				try {
					const response = await POST_EMAIL_EXIST(userDispatch, {
						email: email.value,
					})
					const resData = response.data
					console.log(resData)
					if (resData.data === 1) {
						navigate(PWD_VERIFIED_SCREEN, { email: email.value })
					} else {
						$alert('존재 하지 않는 이메일 입니다.')
					}
				} catch (error) {
					console.log(' error => ', error)
				}
			}
		}
	}

	function validationCheck() {
		const emailError = emailValidator(email.value)

		if (emailError) {
			setEmail({ ...email, error: emailError })
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
						? verticalScale(verticalScale(getStatusBarHeight()) + verticalScale(50))
						: verticalScale(verticalScale(getStatusBarHeight()) + verticalScale(60))
				}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<Container>
						<SmallText style={styles.textView}>이메일</SmallText>

						<TextInput
							placeholder="이메일을 입력하세요"
							value={email.value}
							keyboardType={'email-address'}
							type={'text'}
							isShadow={false}
							autoFocus={true}
							onChangeText={(text) => setEmail({ value: text, error: '' })}
							errorText={email.error}
							inputStyle={styles.inputViewEditable}
							style={{
								...styles.textInput,
								marginBottom: email.error ? verticalScale(300) : verticalScale(16),
								marginRight: email.error ? horizontalScale(250) : verticalScale(0),
							}}
							setRemoveText={() => setEmail({ value: '', error: '' })}
							returnKeyType="done"
							onSubmitEditing={() => handlePressFindEmail()}
							childRef={enterRef}
						/>
					</Container>
				</TouchableWithoutFeedback>

				<Footer>
					<ConfirmButton
						onPress={() => handlePressFindEmail()}
						style={{
							bottom: verticalScale(40),
							backgroundColor: email.value ? theme.colors.turquoise : theme.colors.disabled,
						}}
					>
						<SmallText style={styles.buttonText}>비밀번호 변경하기</SmallText>
					</ConfirmButton>
				</Footer>
			</KeyboardAvoidingView>
		</>
	)
}

const styles = StyleSheet.create({
	imageView: {
		flex: 1,
		marginTop: verticalScale(18),
		marginRight: horizontalScale(15),
		alignSelf: 'flex-start',
	},
	textView: {
		fontSize: moderateScale(13),
		color: theme.colors.text,
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
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
})
