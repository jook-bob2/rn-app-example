import { useUser } from '@/core/store/common/providers/UserProvider'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'
import constants from '@/navigations/constants'
import Subtitle from '@/components/ui/text/Subtitle'
import SmallText from '@/components/ui/text/SmallText'
import { verticalScale } from '@/theme/scaling'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import { storageUtil } from '@/utils/storageUtil'
import storageConst from '@/constants/storageConst'

const { AUTH_STACK_FLOW, SIGN_IN_SCREEN } = constants
const { IS_BACK } = storageConst

const ConfirmView = styled.View`
	padding-top: ${verticalScale(20)}px;
	justify-content: center;
	align-items: center;
`

const ConfirmTitleView = styled.View`
	padding-bottom: ${verticalScale(10)}px;
`

export default function AuthContainer({ children }) {
	const { userState } = useUser()
	const { $confirm } = useConfirm()
	const { navigate, goBack } = useNavigation()

	useFocusEffect(
		useCallback(() => {
			if (!userState.accessToken) {
				$confirm({
					msg: () => {
						return (
							<ConfirmView>
								<ConfirmTitleView>
									<Subtitle>로그인이 필요한 서비스입니다.</Subtitle>
								</ConfirmTitleView>
								<SmallText>로그인 페이지로 이동하시겠습니까?</SmallText>
							</ConfirmView>
						)
					},
					cancelButtonName: '아니오',
					confirmButtonName: '예',
					onPress: (result) => {
						setTimeout(async () => {
							await setBackAvailable(result)
						}, 0)
					},
				})
			}
		}, [userState.accessToken]),
	)

	async function setBackAvailable(isBack) {
		if (isBack) {
			try {
				const isData = await storageUtil.setItem({
					key: IS_BACK,
					value: true,
					options: { addHours: 24 },
				})
				if (isData) {
					navigate(AUTH_STACK_FLOW, { screen: SIGN_IN_SCREEN })
				}
			} catch (err) {
				console.log('back error => ', err)
			}
		} else {
			try {
				const isData = await storageUtil.setItem({
					key: IS_BACK,
					value: false,
					options: { addHours: 24 },
				})
				if (!isData) {
					goBack()
				}
			} catch (err) {
				console.log('back error => ', err)
			}
		}
	}

	return <>{children}</>
}
