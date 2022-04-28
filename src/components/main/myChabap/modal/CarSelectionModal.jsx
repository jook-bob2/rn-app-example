import Select from '@/components/ui/select/Select'
import { useUser } from '@/core/store/common/providers/UserProvider'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { storageUtil } from '@/utils/storageUtil'
import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components/native'
import storageConst from '@/constants/storageConst'
import { PATCH_CHANGE_DEFAULT_USER_EV } from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import SmallText from '@/components/ui/text/SmallText'
import { StyleSheet } from 'react-native'
import Loading from '@/components/ui/Loading'
import { useConnector } from '@/core/store/common/providers/ConnectorStatusProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import userConst from '@/constants/userConst'
import { useError } from '@/core/store/common/providers/ErrorProvider'

const { USER_INFO } = storageConst

const Header = styled.View`
	flex-direction: column;
	padding-top: 16px;
	padding-left: 16px;
`

const CarSelectViewContainer = styled.View`
	flex-direction: row;
	justify-content: flex-start;
`

const CarInfoViewContainer = styled.View`
	flex-direction: row;
	justify-content: flex-start;
	padding-top: ${verticalScale(8)}px;
`

const UserImage = styled.Image`
	width: ${moderateScale(28)}px;
	height: ${moderateScale(28)}px;
`

function CarSelectionModal({ carSelectModalData }) {
	const { evList, setCarValue, carValue, getUserEvList } = carSelectModalData
	const { userState, setUserInfo } = useUser()
	const [changeCarLoading, setChangeCarLoading] = useState(false)
	const { dispatch: userDispatch } = useUserContext()
	const { getConnStatus } = useConnector()
	const { $alert } = useAlert()
	const [isOpen, setIsOpen] = useState(false)
	const { $error } = useError()

	useEffect(() => {
		if (isOpen) {
			getUserEvList()
		}
	}, [isOpen])

	async function updateDefaultUserEv(userEvId) {
		if (userEvId) {
			try {
				const response = await PATCH_CHANGE_DEFAULT_USER_EV(userDispatch, { defaultUserEvId: userEvId })
				const resData = response.data
				if (resData?.success && resData?.data === 1) {
					getUserEvList()

					return true
				}
			} catch (err) {
				console.log('update default user ev error => ', err)
				const errData = err?.data
				if (errData?.code) {
					const { code, msg } = errData
					setTimeout(() => {
						$error({
							code,
							msg,
							onPress: (result) => {
								if (result) {
									updateDefaultUserEv()
								}
							},
						})
					}, 1000)
				}
			}
		}
	}

	async function handleChangeCarValue(item) {
		setChangeCarLoading(true)
		if (item?.userEvId !== carValue?.userEvId) {
			setCarValue({
				value: item.nickname ? item.nickname : item.carNum,
				userEvId: item.userEvId,
			})

			setUserInfo({
				...userState,
				defaultUserEvId: item.userEvId,
			})

			const { data } = await storageUtil.getItem({ key: USER_INFO })

			await storageUtil.setItem({
				key: USER_INFO,
				value: { ...data, defaultUserEvId: item.userEvId },
				options: { addYear: 1 },
			})

			setTimeout(async () => {
				const isChange = await updateDefaultUserEv(item.userEvId)

				if (isChange) {
					getConnStatus(true)
				}
				setChangeCarLoading(false)
			}, 500)
		} else {
			setChangeCarLoading(false)
			$alert('이미 선택된 차량입니다.')
		}
	}
	return (
		<>
			{changeCarLoading && <Loading />}
			<Header>
				<CarSelectViewContainer>
					{evList.length > 0 && (
						<Select
							containerStyle={{
								backgroundColor: theme.colors.white,
							}}
							textStyle={{
								color: theme.colors.darkGray,
								fontFamily: theme.fonts.spoqaHanSansNeo.bold,
								fontSize: moderateScale(16),
							}}
							inputAndroidStyle={{ marginTop: verticalScale(2) }}
							inputIosStyle={{ marginTop: verticalScale(2) }}
							rightIconViewStyle={{ marginTop: verticalScale(2) }}
							items={evList}
							value={evList[0].nickname}
							names={['nickname', 'carNum']}
							onValueChange={(item) => handleChangeCarValue(item)}
							placeholder={'차량을 선택하세요.'}
							isOpen={isOpen}
							setOpen={() => setIsOpen(!isOpen)}
							title={'차량 선택'}
							animationType={'fade'}
							feedbackStyle={{ height: '72%' }}
							leftIcon={
								userState.userTypeCd === userConst.USER_PERSONAL ? (
									<UserImage source={require('@assets/icons/personal.png')} />
								) : (
									<UserImage source={require('@assets/icons/corporation.png')} />
								)
							}
						/>
					)}
				</CarSelectViewContainer>
				{evList.length > 0 && (
					<CarInfoViewContainer>
						<SmallText style={styles.carInfoText}>{evList[0].manufacturer}</SmallText>
						<SmallText style={{ ...styles.carInfoText, marginHorizontal: horizontalScale(4) }}>
							{' | '}
						</SmallText>
						<SmallText style={styles.carInfoText}>{evList[0].model}</SmallText>
						<SmallText style={{ ...styles.carInfoText, marginHorizontal: horizontalScale(4) }}>
							{' | '}
						</SmallText>
						<SmallText style={styles.carInfoText}>{evList[0].nickname}</SmallText>
					</CarInfoViewContainer>
				)}
			</Header>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.white,
		borderWidth: verticalScale(1),
		borderRadius: moderateScale(10),
		borderColor: theme.colors.background,
	},
	button: {
		borderRadius: moderateScale(22),
		width: '100%',
		height: moderateScale(48),
	},
	buttonText: {
		color: theme.colors.white,
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		fontSize: moderateScale(16),
	},
	carInfoText: {
		color: theme.colors.darkGray,
	},
})

export default memo(CarSelectionModal)
