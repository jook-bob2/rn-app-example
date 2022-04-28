import constants from '@/navigations/constants'
import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import Paragraph from '../ui/text/Paragraph'
import SmallText from '../ui/text/SmallText'

const { SEARCH_TAB_FLOW, CHARGING_STATION_DETAIL_SCREEN } = constants

export default function ChargingStationPopular() {
	const { navigate } = useNavigation()
	return (
		<View>
			<Paragraph>인기 차밥 충전소</Paragraph>
			<TouchableOpacity onPress={() => navigate(SEARCH_TAB_FLOW, { screen: CHARGING_STATION_DETAIL_SCREEN })}>
				<SmallText>충전소 상세 정보로 이동</SmallText>
			</TouchableOpacity>
		</View>
	)
}
