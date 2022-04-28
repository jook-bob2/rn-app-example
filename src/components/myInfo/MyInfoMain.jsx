import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { useNavigation } from '@react-navigation/core'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React from 'react'
import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import SmallText from '../ui/text/SmallText'

const Container = styled.View`
	flex: 1;
	padding: ${moderateScale(18)}px;
`

const Contents = styled.TouchableOpacity`
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(15)}px;
	border-color: ${theme.colors.disabled};
	margin: ${verticalScale(5)}px ${horizontalScale(2.5)}px;
	padding: ${moderateScale(13)}px;
`

const Image = styled.Image`
	width: ${moderateScale(25)}px;
	height: ${moderateScale(25)}px;
	tint-color: ${({ tintColor }) => (tintColor ? tintColor : theme.colors.disabled)};
`

const ColumnContents = styled.ScrollView`
	flex: 1;
`
const ContentsView = styled.View`
	flex: 1;
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
	padding: 0 ${moderateScale(10)}px;
`

const {
	MY_CHABAP_TAB_FLOW,
	MY_INFO_MODIFY_SCREEN,
	MY_INFO_CHANGE_PASSWORD_SCREEN,
	MY_INFO_CHANGE_CAR_INFO_SCREEN,
	MY_INFO_CHANGE_CARD_INFO_SCREEN,
} = constants

export default function MyInfoMain() {
	const { navigate } = useNavigation()
	return (
		<Container>
			<ColumnContents>
				<Contents
					style={styles.contents}
					onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: MY_INFO_MODIFY_SCREEN })}
				>
					<ContentsView>
						<SmallText>회원정보 수정</SmallText>
						<Image source={require('@assets/icons/arrow_next.png')} />
					</ContentsView>
				</Contents>
				<Contents
					style={styles.contents}
					onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: MY_INFO_CHANGE_PASSWORD_SCREEN })}
				>
					<ContentsView>
						<SmallText>비밀번호 변경</SmallText>
						<Image source={require('@assets/icons/arrow_next.png')} />
					</ContentsView>
				</Contents>
				<Contents
					style={styles.contents}
					onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: MY_INFO_CHANGE_CAR_INFO_SCREEN })}
				>
					<ContentsView>
						<SmallText>차량정보 수정</SmallText>
						<Image source={require('@assets/icons/arrow_next.png')} />
					</ContentsView>
				</Contents>
				<Contents
					style={styles.contents}
					onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: MY_INFO_CHANGE_CARD_INFO_SCREEN })}
				>
					<ContentsView>
						<SmallText>결제수단 관리</SmallText>
						<Image source={require('@assets/icons/arrow_next.png')} />
					</ContentsView>
				</Contents>
			</ColumnContents>
		</Container>
	)
}

const styles = StyleSheet.create({
	contents: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(5),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(4.65),
		elevation: 5,
	},
})
