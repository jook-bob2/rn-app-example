import Paragraph from '@/components/ui/text/Paragraph'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import constants from '@/navigations/constants'
import { useNavigation } from '@react-navigation/core'
import { theme } from '@/theme'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import styled from 'styled-components/native'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'

const { MY_CHABAP_TAB_FLOW, NOTICE_LIST_SCREEN } = constants

const Container = styled.ScrollView`
	padding: ${moderateScale(10)}px;
`
const Contents = styled.View`
	justify-content: center;
	align-items: center;
`
const ItemView = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
	padding: 0px 0px;
`
const NewItemView = styled.View`
	width: 90%;
	padding: 6px 0px;
	border-bottomwidth: 0.5px;
	border-color: #e5e5e5;
	border-style: solid;
`
const Image = styled.Image`
	width: ${moderateScale(18)}px;
	height: ${moderateScale(18)}px;
`
const NewImage = styled.Image`
	width: ${moderateScale(14)}px;
	height: ${moderateScale(14)}px;
	justify-content: flex-end;
`

export default function ListPartAlarmList() {
	const { navigate } = useNavigation()
	return (
		<Container>
			<Contents>
				<ItemView style={styles.TopItemView}>
					<Left>
						<Paragraph style={styles.Paragraph}>차밥공지</Paragraph>
					</Left>
					<Right>
						<TouchableOpacity
							style={styles.Button}
							onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: NOTICE_LIST_SCREEN })}
						>
							<Text style={styles.Text}>더보기</Text>
							<Image
								style={styles.ImagePointor}
								tintColor={theme.colors.darkGray}
								source={require('@assets/icons/pointor_right.png')}
							/>
						</TouchableOpacity>
					</Right>
				</ItemView>
				<NewItemView>
					<View style={styles.ItemView}>
						<Paragraph style={styles.ViewParagraph}>차밥 충전 요금 변경 안내</Paragraph>
						<NewImage style={styles.ImageRoundNew} source={require('@assets/icons/round_new.png')} />
					</View>
					<Text style={styles.ViewText}>2021.10.11</Text>
				</NewItemView>
				<NewItemView>
					<View style={styles.ItemView}>
						<Paragraph style={styles.ViewParagraph}>차밥 충전 요금 변경 안내</Paragraph>
						<NewImage style={styles.ImageRoundNew} source={require('@assets/icons/round_new.png')} />
					</View>
					<Text style={styles.ViewText}>2021.10.11</Text>
				</NewItemView>
				<NewItemView>
					<View style={styles.ItemView}>
						<Paragraph style={styles.ViewParagraph}>차밥 충전 요금 변경 안내</Paragraph>
						<NewImage style={styles.ImageRoundNew} source={require('@assets/icons/round_new.png')} />
					</View>
					<Text style={styles.ViewText}>2021.10.11</Text>
				</NewItemView>
			</Contents>
		</Container>
	)
}

const styles = StyleSheet.create({
	Paragraph: {
		marginLeft: moderateScale(20),
		fontSize: 14,
		color: theme.colors.darkGray,
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	Button: {
		width: moderateScale(93),
		height: moderateScale(23),
		marginRight: horizontalScale(10),
		borderRadius: 25,
		paddingTop: moderateScale(2),
		backgroundColor: theme.colors.turquoise,
		flexDirection: 'row',
		shadowColor: '#000',
		shadowOffset: {
			width: moderateScale(1.2),
			height: verticalScale(4),
		},
		shadowOpacity: 0.2,
		shadowRadius: moderateScale(1.2),
		elevation: 5,
	},
	Text: {
		fontSize: 12,
		lineHeight: horizontalScale(15),
		color: 'white',
		flex: 1,
		marginLeft: horizontalScale(10),
		alignSelf: 'center',
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	ImagePointor: {
		marginRight: horizontalScale(10),
		marginTop: moderateScale(1),
	},
	ViewText: {
		width: moderateScale(330),
		fontSize: 13,
		alignItems: 'center',
		justifyContent: 'center',
		color: '#CFCDCD',
	},
	ItemView: {
		flexDirection: 'row',
	},
	ImageRoundNew: {
		marginLeft: moderateScale(5),
		marginTop: moderateScale(4),
	},
	ViewParagraph: {
		fontSize: 15,
		fontFamily: theme.fonts.spoqaHanSansNeo.light,
		marginBottom: moderateScale(3),
	},
	TopItemView: {
		marginTop: moderateScale(3),
	},
})
