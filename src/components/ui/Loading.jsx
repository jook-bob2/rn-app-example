import { theme } from '@/theme'
import { moderateScale } from '@/theme/scaling'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-native'
import styled from 'styled-components/native'
import LottieView from 'lottie-react-native'

const Contents = styled.View`
	${theme.common.flexCenterColumn}
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 9999;
	background-color: rgba(0, 0, 0, 0.4);
`

const Wrap = styled.View`
	padding: ${moderateScale(16)}px;
	justify-content: center;
	align-items: center;
	border-radius: ${moderateScale(25)}px;
`

export default function Loading() {
	const [isLoading, setIsLoading] = useState(true)
	useEffect(() => {
		return () => {
			setIsLoading(false)
		}
	}, [])

	return (
		<Modal animationType="none" transparent={true} visible={isLoading}>
			<Contents>
				<Wrap>
					<LottieView autoSize source={require('@assets/loading/loading.json')} autoPlay loop />
				</Wrap>
			</Contents>
		</Modal>
	)
}
