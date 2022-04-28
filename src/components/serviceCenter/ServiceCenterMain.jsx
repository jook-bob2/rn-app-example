import React from 'react'
import styled from 'styled-components/native'
import { StyleSheet } from 'react-native'
import { theme } from '@/theme'
import SmallText from '../ui/text/SmallText'
import constants from '@/navigations/constants'
import { useNavigation } from '@react-navigation/core'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'

const { MY_CHABAP_TAB_FLOW, FAQ_LIST_SCREEN, INQUIRY_WRITE_SCREEN, INQUIRY_LIST_SCREEN } = constants

const Container = styled.View`
	flex: 1;
	padding: ${moderateScale(18)}px;
	background-color: #f8f8fa;
`
const ColumnContents = styled.ScrollView`
	flex: 0.8;
`
const Contents = styled.TouchableOpacity`
	flex: 1;
	justify-content: center;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: ${theme.colors.white};
	margin: ${verticalScale(5)}px ${horizontalScale(2.5)}px;
	padding: ${moderateScale(13)}px;
`
const ContentsView = styled.View`
	flex-direction: row;
	justify-content: space-between;
	padding: 0 ${moderateScale(5)}px;
`
const Image = styled.Image`
	width: ${moderateScale(18)}px;
	height: ${moderateScale(18)}px;
	tint-color: ${({ tintColor }) => (tintColor ? tintColor : theme.colors.disabled)};
`
export default function ServiceCenterMain() {
	const { navigate } = useNavigation()
	return (
		<Container>
			<ColumnContents>
				<Contents
					style={styles.contents}
					onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: FAQ_LIST_SCREEN })}
				>
					<ContentsView>
						<SmallText style={{ fontSize: 15 }}>FAQ</SmallText>
						<Image source={require('@assets/icons/arrow_next.png')} />
					</ContentsView>
				</Contents>
				<Contents
					style={styles.contents}
					onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: INQUIRY_WRITE_SCREEN })}
				>
					<ContentsView>
						<SmallText style={{ fontSize: 15 }}>1:1 문의하기</SmallText>
						<Image source={require('@assets/icons/arrow_next.png')} />
					</ContentsView>
				</Contents>
				<Contents
					style={styles.contents}
					onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: INQUIRY_LIST_SCREEN })}
				>
					<ContentsView>
						<SmallText style={{ fontSize: 15 }}>문의내역</SmallText>
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
			height: verticalScale(1),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(0.5),
		elevation: 1,
	},
})
