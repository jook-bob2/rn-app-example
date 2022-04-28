import TextInput from '@/components/ui/input/TextInput'
import Loading from '@/components/ui/Loading'
//import userConst from '@/constants/userConst'
import { GET_USER_EV_INFO, PATCH_USER_EV } from '@/core/store/api/create/userEvCreate'
import { useUserEvContext } from '@/core/store/api/providers/UserEvApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { useNavigation, useRoute } from '@react-navigation/core'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components'
import SmallText from '../ui/text/SmallText'

const { MY_INFO_CAR_MNGT_SCREEN } = constants
// const { USER_CORPORATION, USER_PERSONAL, USER_PERSONAL_EV } = userConst
const Container = styled.View`
	flex: 1;
	background-color: ${theme.colors.background};
`

const Contents = styled.View`
	flex: 1;
	padding: ${moderateScale(24)}px;
	padding-top: ${verticalScale(24)}px;
`

const SignInBtnView = styled.View`
	flex: 1;
	justify-content: flex-end;
	align-items: center;
`

const ConfirmButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 80%;
	height: ${verticalScale(55)}px;
	background-color: ${theme.colors.turquoise};
	border-color: ${theme.colors.white};
	border-radius: ${moderateScale(8)}px;
	border-width: ${moderateScale(1)}px;
	flex-direction: row;
`

export default function MyInfoChangeCarInfo() {
	const { goBack } = useNavigation()
	//const [useCarNo, setUseCarNo] = useState({ value: '', error: '' })
	const [carNickName, setCarNickName] = useState('')
	const { params } = useRoute()
	const { $alert, closeAlert } = useAlert()
	const { $confirm, closeConfirm } = useConfirm()
	const { state: evUpdateState, dispatch: evUpdate } = useUserEvContext()
	const { loading: evUpdateLoading } = evUpdateState.userEvModify
	const { state: evInfoState, dispatch: evInfo } = useUserEvContext()
	const { loading: evInfoLoading } = evInfoState.userEvInfo

	const {
		userState: { userTypeCd },
	} = useUser()

	useFocusEffect(
		useCallback(() => {
			getUserEvInfo()
		}, [params?.userEvId]),
	)

	async function getUserEvInfo() {
		try {
			const response = await GET_USER_EV_INFO(evInfo, {
				id: params?.userEvId,
			})

			const resData = response.data.data
			if (resData) {
				setCarNickName(resData.nickname)
			}
		} catch (e) {
			console.log('error: ', e)
		}
	}
	async function handleUpdateEv() {
		try {
			const response = await PATCH_USER_EV(evUpdate, {
				id: params?.userEvId,
				nickName: carNickName,
			})
			const resData = response.data

			if (resData.data === true) {
				$alert('수정되었습니다.')
				closeConfirm()
				setTimeout(() => {
					closeAlert()
					goBack(MY_INFO_CAR_MNGT_SCREEN)
					// reset({
					// 	routes: [
					// 		{
					// 			name: MY_INFO_CAR_MNGT_SCREEN,
					// 		},
					// 	],
					// })
				}, 1000)
			} else if (resData?.code !== 'SUCCESS') {
				$alert(resData?.msg)
			} else {
				$alert('수정이 취소되었습니다.')
			}
		} catch (error) {
			console.log('ev add error: ', error)
		}
	}

	//수정 핸들
	function handleConfirmModify() {
		if (carNickName) {
			$confirm({
				msg: '정보를 수정 하시겠습니까?',
				cancelButtonName: '아니오',
				confirmButtonName: '예',
				onPress: (result) => {
					if (result) {
						handleUpdateEv()
					}
				},
			})
		} else {
			$alert('차량 닉네임을 입력해주세요.')
		}
	}
	return (
		<>
			{evInfoLoading || (evUpdateLoading && <Loading />)}
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<Container>
					<Contents>
						<SmallText style={styles.textView}>분류</SmallText>
						<TextInput
							isShadow={false}
							editable={false}
							value={userTypeCd === 'PERSON' ? '개인' : '법인'}
							style={{ ...styles.textInputStyle }}
						/>

						<SmallText style={styles.textView}>닉네임</SmallText>

						<TextInput
							placeholder="차량 닉네임을 입력하세요(최대 10자)"
							value={carNickName}
							type={'text'}
							onChangeText={(text) => setCarNickName(text)}
							setRemoveText={() => setCarNickName('')}
							maxLength={10}
							isShadow={false}
							style={{ ...styles.textInputStyle }}
						/>
					</Contents>

					<SignInBtnView>
						<ConfirmButton
							onPress={() => handleConfirmModify()}
							style={{
								bottom: verticalScale(40),
								backgroundColor: carNickName ? theme.colors.turquoise : theme.colors.disabled,
							}}
						>
							<SmallText style={styles.buttonText}>수정완료</SmallText>
						</ConfirmButton>
					</SignInBtnView>
				</Container>
			</TouchableWithoutFeedback>
		</>
	)
}
const styles = StyleSheet.create({
	right: {
		marginRight: 10,
	},
	textView: {
		fontWeight: 'bold',
		marginBottom: verticalScale(10),
		marginLeft: horizontalScale(16),
	},

	textInputStyle: {
		borderRadius: 5,
		marginBottom: verticalScale(15),
		backgroundColor: theme.colors.white,
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(15),
		color: theme.colors.white,
	},

	inputItem: {
		backgroundColor: theme.colors.white,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.29,
		shadowRadius: 4.65,
		elevation: 5,
		borderBottomColor: theme.colors.disabled,
		borderBottomWidth: 1,
		width: '100%',
		height: 51,
		borderRadius: 33,
	},
})
