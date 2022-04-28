import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Paragraph from '../ui/text/Paragraph'
import constants from '@/navigations/constants'
import { useNavigation } from '@react-navigation/core'
import { theme } from '@/theme'
import styled from 'styled-components/native'
import Left from '../ui/view/Left'
import Right from '../ui/view/Right'
import { verticalScale, moderateScale } from '@theme/scaling'

const { MY_CHABAP_TAB_FLOW, CHABAP_GUIDE_SCREEN, NOTICE_LIST_PART_SCREEN } = constants

const Container = styled.ScrollView`
	flex: 1;
	padding: 20px 20px;
`
const Contents = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`

const ItemView = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
	padding: 12px 21px;
`
const Image = styled.Image`
	width: 18px;
	height: 18px;
`
export default function NoticeMain() {
	const { navigate } = useNavigation()
	return (
		<Container>
			<Contents>
				<ItemView style={styles.bottom}>
					<Left>
						<Paragraph style={styles.itemText}>차밥안내</Paragraph>
					</Left>
					<Right>
						<TouchableOpacity onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: CHABAP_GUIDE_SCREEN })}>
							<Image tintColor={theme.colors.darkGray} source={require('@assets/icons/arrow_next.png')} />
						</TouchableOpacity>
					</Right>
				</ItemView>
				<ItemView style={styles.bottom}>
					<Left>
						<Paragraph style={styles.itemText}>공지사항</Paragraph>
					</Left>
					<Right>
						<TouchableOpacity
							onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: NOTICE_LIST_PART_SCREEN })}
						>
							<Image tintColor={theme.colors.darkGray} source={require('@assets/icons/arrow_next.png')} />
						</TouchableOpacity>
					</Right>
				</ItemView>
			</Contents>
		</Container>
	)
}
const styles = StyleSheet.create({
	itemText: {
		color: theme.colors.darkGray,
	},
	bottom: {
		marginBottom: 12,
		backgroundColor: theme.colors.white,
		borderWidth: 1,
		borderRadius: 18,
		borderColor: theme.colors.disabled,
		shadowColor: '#000',
		shadowOffset: {
			width: moderateScale(1.2),
			height: verticalScale(4),
		},
		shadowOpacity: 0.2,
		shadowRadius: moderateScale(1.2),
		elevation: 5,
	},
})
