import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { StyleSheet } from 'react-native'
import SmallText from '../ui/text/SmallText'
import { moderateScale } from '@theme/scaling'
import constants from '@/navigations/constants'

const { MAIN_TAB_FLOW, MAIN_SCREEN } = constants

const Container = styled.View`
	flex: 1;
`

const Contents = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`

const Image = styled.Image`
	width: ${moderateScale(200)}px;
	height: ${moderateScale(200)}px;
	tint-color: ${({ tintColor }) => (tintColor ? tintColor : theme.colors.placeholder)};
`

const ButtonView = styled.View`
	flex: 1;
	justify-content: flex-end;
`

const Button = styled.TouchableOpacity`
	align-items: center;
	background-color: ${theme.colors.turquoise};
	padding: ${moderateScale(20)}px;
`

export default function InicisPaymentResult() {
	const { navigate } = useNavigation()
	const { params } = useRoute()

	useFocusEffect(
		useCallback(() => {
			console.log('InicisPaymentResult params : ', params)
		}, [params]),
	)

	return (
		<Container>
			<Contents>
				<Image source={require('@assets/icons/chabap_logo_2.png')} tintColor={theme.colors.turquoise} />
				<SmallText style={styles.resultText}>결제가 완료되었습니다.</SmallText>
			</Contents>

			<ButtonView>
				<Button onPress={() => navigate(MAIN_TAB_FLOW, { screen: MAIN_SCREEN })}>
					<SmallText style={styles.buttonText}>확인</SmallText>
				</Button>
			</ButtonView>

			{/* <View>
				<SmallText style={styles.nameText}>P_RMESG1 (결과메세지)</SmallText>
				<SmallText> : </SmallText>
				<SmallText style={styles.valueText}>{params?.P_RMESG1}</SmallText>
			</View>

			<View>
				<SmallText style={styles.nameText}>P_STATUS (결과코드)</SmallText>
				<SmallText> : </SmallText>
				<SmallText style={styles.valueText}>{params?.P_STATUS}</SmallText>
			</View>

			<View>
				<SmallText style={styles.nameText}>P_TID (승인거래번호)</SmallText>
				<SmallText> : </SmallText>
				<SmallText style={styles.valueText}>{params?.P_TID}</SmallText>
			</View> */}
		</Container>
	)
}

const styles = StyleSheet.create({
	resultText: {
		fontWeight: 'bold',
		fontSize: moderateScale(18),
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: '#fff',
	},
})
