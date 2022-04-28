import React, { useCallback, useState } from 'react'
import { useRoute } from '@react-navigation/core'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { Keyboard, StyleSheet, View } from 'react-native'
import SmallText from '../ui/text/SmallText'
import TextInput from '@/components/ui/input/TextInput'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { useUserEvContext } from '@/core/store/api/providers/UserEvApiProvider'
import { GET_CHECK_SHARE, POST_APPROVE_SHARE } from '@/core/store/api/create/userEvCreate'
import constants from '@/navigations/constants'
import { nicknameValidator, sharePasswdValidator } from '@/utils/validator'

const Container = styled.View`
	flex: 1;
	padding: ${moderateScale(22)}px;
	background-color: #f8f8fa;
`

// flex: 0.1;
const TopView = styled.View`
	align-items: center;
	padding: ${moderateScale(15)}px;
`

// flex: 0.2;
const InputView = styled.View`
	padding: ${moderateScale(15)}px;
`

// flex: 0.4;
// height: 45%;
const ButtonView = styled.View`
	justify-content: flex-end;
	padding: ${moderateScale(10)}px;
`

const Button = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.turquoise};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(10)}px;
	border-color: ${theme.colors.turquoise};
	padding: 15px;
`

const { MAIN_TAB_FLOW, MAIN_SCREEN } = constants

export default function MyChabapShared() {
	const { params } = useRoute()
	const { $alert } = useAlert()
	const { navigate } = useNavigation()
	const [page, setPage] = useState('passwd')
	const [visiblePasswd, setVisiblePasswd] = useState(true)
	const [nickname, setNickname] = useState({ value: '', error: '' })
	const [passwd, setPasswd] = useState({ value: '', error: '' })
	const [approveShareData, setApproveShareData] = useState({
		shareQueueId: '',
		userEvId: '',
		model: '',
		passwd: '',
		nickname: '',
	})
	const { dispatch } = useUserEvContext()

	useFocusEffect(
		useCallback(() => {
			setPage('passwd')
			setNickname({ value: '', error: '' })
			setPasswd({ value: '', error: '' })
		}, []),
	)

	useFocusEffect(
		useCallback(() => {
			const { shareQueueId, userEvId, model } = params

			setApproveShareData({
				...approveShareData,
				shareQueueId,
				userEvId,
				model,
			})
		}, [params]),
	)

	// 공유 비밀번호 체크
	async function handlePressCheckSharePassword() {
		if (validationCheckPassword()) {
			try {
				const response = await GET_CHECK_SHARE(dispatch, {
					shareQueueId: approveShareData.shareQueueId,
					passwd: passwd.value,
				})
				if (response.data.success) {
					if (response.data.data === 1) {
						setPage('nickname')
					}
				} else {
					$alert(response.data.msg)
				}
			} catch (e) {
				console.log(e)
			}
		}
	}

	// 공유 승인
	async function handlePressApproveShare() {
		Keyboard.dismiss()

		if (validationCheckNickname()) {
			try {
				const response = await POST_APPROVE_SHARE(dispatch, { ...approveShareData, nickname: nickname.value })
				if (response.data.success) {
					if (response.data.data === 1) {
						$alert({
							title: '\n 새로운 차밥 식구로 공유받았습니다.',
							msg: '\n *마이차밥 > 차량관리에서 \n 공유된 차량을 관리할 수 있습니다. \n',
							onPress: () => navigate(MAIN_TAB_FLOW, { screen: MAIN_SCREEN }),
						})
					}
				} else {
					$alert(response.data.msg)
				}
			} catch (e) {
				console.log(e)
			}
		}
	}

	function validationCheckPassword() {
		const passwordError = sharePasswdValidator(passwd.value)

		if (passwordError) {
			setPasswd({ ...passwd, error: passwordError })
			return false
		}

		return true
	}

	function validationCheckNickname() {
		const nicknameError = nicknameValidator(nickname.value)

		if (nicknameError) {
			setNickname({ ...nickname, error: nicknameError })
			return false
		}

		return true
	}

	return (
		<Container>
			<TopView>
				<SmallText style={styles.mainText}>{approveShareData.model}</SmallText>
			</TopView>

			{page === 'nickname' && (
				<View>
					<InputView>
						<SmallText style={styles.boldText}>닉네임</SmallText>
						<View style={{ margin: moderateScale(5) }} />

						<TextInput
							type={'text'}
							placeholder="닉네임을 입력하세요. (1 ~ 10 자리)"
							value={nickname.value}
							errorText={nickname.error}
							secureTextEntry={false}
							isShadow={false}
							style={{
								...styles.textInput,
								marginBottom: nickname.error ? verticalScale(20) : verticalScale(1),
							}}
							onChangeText={(text) => setNickname({ value: text, error: '' })}
							setRemoveText={() => setNickname({ value: '', error: '' })}
							returnKeyType="done"
							keyboardType="default"
							onSubmitEditing={() => {}}
						/>
						<View style={{ margin: moderateScale(5) }} />
						<SmallText
							style={[styles.referenceText, nickname.error ? { marginTop: verticalScale(10) } : null]}
						>
							*공유받은 차량의 닉네임을 설정해주세요.
						</SmallText>
					</InputView>

					<ButtonView>
						<Button onPress={() => handlePressApproveShare()}>
							<SmallText style={styles.buttonText}>확인</SmallText>
						</Button>
					</ButtonView>
				</View>
			)}

			{page === 'passwd' && (
				<View>
					<InputView>
						<SmallText style={styles.boldText}>비밀번호</SmallText>
						<View style={{ margin: moderateScale(5) }} />
						<TextInput
							type={'password'}
							placeholder="공유 비밀번호를 입력하세요. (4자리)"
							value={passwd.value}
							errorText={passwd.error}
							secureTextEntry={visiblePasswd}
							isShadow={false}
							style={{
								...styles.textInput,
								marginBottom: passwd.error ? verticalScale(20) : verticalScale(1),
							}}
							onChangeText={(text) => setPasswd({ value: text, error: '' })}
							setRemoveText={() => setPasswd({ value: '', error: '' })}
							setVisible={() => setVisiblePasswd(!visiblePasswd)}
							keyboardType="number-pad"
							returnKeyType="done"
							onSubmitEditing={() => {}}
						/>
						<View style={{ margin: moderateScale(5) }} />
						<SmallText
							style={[styles.referenceText, passwd.error ? { marginTop: verticalScale(10) } : null]}
						>
							*식구 공유자로부터 공유 비밀번호를 확인하세요.
						</SmallText>
					</InputView>

					<ButtonView>
						<Button onPress={() => handlePressCheckSharePassword()}>
							<SmallText style={styles.buttonText}>확인</SmallText>
						</Button>
					</ButtonView>
				</View>
			)}
		</Container>
	)
}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(1),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(0.5),
		elevation: 1,
	},
	mainText: {
		fontWeight: 'bold',
		fontSize: moderateScale(25),
	},
	boldText: {
		fontWeight: 'bold',
		fontSize: moderateScale(15),
	},
	buttonText: {
		color: theme.colors.white,
		fontWeight: 'bold',
		fontSize: moderateScale(15),
	},
	referenceText: {
		color: theme.colors.turquoise,
		fontWeight: 'bold',
	},
	textInput: {
		borderBottomColor: theme.colors.disabled,
		borderBottomWidth: moderateScale(1),
	},
})
