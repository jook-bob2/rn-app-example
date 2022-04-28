import React from 'react'
import styled from 'styled-components/native'
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { theme } from '@/theme'
import SmallText from '@/components/ui/text/SmallText'
import Paragraph from '../ui/text/Paragraph'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import { useNavigation } from '@react-navigation/core'
import constants from '@/navigations/constants'

const { SEARCH_TAB_FLOW, CHARGING_STATION_DETAIL_SCREEN } = constants

const Container = styled.View`
	flex: 1;
	margin-bottom: ${verticalScale(10)}px;
`

const Contents = styled.View`
	padding: 0px ${horizontalScale(40)}px;
`

const DATA = []
for (let i = 0; i < 10; i++) {
	DATA.push(i)
}

export default function ChargingStationNear() {
	const { navigate } = useNavigation()
	return (
		<Container>
			<ScrollView>
				{DATA.map((item) => (
					<TouchableOpacity
						key={item}
						onPress={() => navigate(SEARCH_TAB_FLOW, { screen: CHARGING_STATION_DETAIL_SCREEN })}
					>
						<Contents style={styles.contents}>
							<Paragraph>차밥 충전소</Paragraph>
							<SmallText>서울특별시 강남구 강남대로 318 TOWER837</SmallText>
							<SmallText>300m | 15분</SmallText>
							<Paragraph>충전 가능</Paragraph>
						</Contents>
					</TouchableOpacity>
				))}
			</ScrollView>
		</Container>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.white,
		borderWidth: horizontalScale(1),
		borderRadius: moderateScale(20),
		borderColor: theme.colors.disabled,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(5),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(4.65),
		elevation: 5,
	},
	contents: {
		backgroundColor: theme.colors.white,
		borderWidth: horizontalScale(1),
		borderRadius: moderateScale(20),
		borderColor: theme.colors.disabled,
		marginLeft: 20,
		marginRight: 20,
		marginTop: 10,
		paddingTop: 10,
		paddingBottom: 20,
	},
	fontWhite: {
		color: theme.colors.white,
	},
})
