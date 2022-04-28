import React, { useState } from 'react'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { StyleSheet, View } from 'react-native'
import SmallText from '../ui/text/SmallText'
import Button from '../ui/button/Button'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'

const Container = styled.View`
	flex: 1;
	padding: ${moderateScale(15)}px;
`

const InputView = styled.View`
	flex: 0.12;
	flex-direction: row;
	justify-content: space-between;
	padding: ${moderateScale(10)}px;
`

const ButtonView = styled.View`
	flex: 0.2;
	align-items: center;
	justify-content: center;
`

const TextInput = styled.TextInput`
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(22)}px;
	border-color: ${theme.colors.disabled};
	padding: ${verticalScale(4)}px ${horizontalScale(15)}px;
`

export default function MyChabapCarShareRequest() {
	const [shareQueueData, setShareQueueData] = useState({
		hp: '',
	})

	// 공유 요청

	return (
		<Container>
			<InputView>
				<View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center' }}>
					<SmallText>휴대폰</SmallText>
				</View>
				<View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'flex-end' }}>
					<TextInput
						value={shareQueueData.hp}
						placeholder="차량소유자의 휴대전화를 입력해주세요."
						onChangeText={(text) =>
							setShareQueueData({
								...shareQueueData,
								hp: text,
							})
						}
					/>
					<SmallText style={[styles.referenceText, { fontSize: 12 }]}>
						*차량소유자에게 이용권한을 요청해주세요.
					</SmallText>
				</View>
			</InputView>
			<ButtonView>
				<Button style={[styles.shadow, { backgroundColor: theme.colors.disabled }]} onPress={() => {}}>
					<SmallText style={styles.buttonText}>요청하기</SmallText>
				</Button>
			</ButtonView>
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
	buttonText: {
		fontWeight: 'bold',
		color: 'white',
	},
	referenceText: {
		color: theme.colors.turquoise,
	},
})
