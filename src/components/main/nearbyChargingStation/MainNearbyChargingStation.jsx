import SmallText from '@/components/ui/text/SmallText'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import { theme } from '@/theme'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import React, { useCallback, useRef } from 'react'
import { Animated, Platform, StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'
import constants from '@/navigations/constants'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import { useStationContext } from '@/core/store/api/providers/StationApiProvider'
import Row from '@component/ui/view/Row'
import statusConst from '@/constants/statusConst'

const { SEARCH_TAB_FLOW, CHARGING_STATION_SEARCH_SCREEN, CHARGING_STATION_MAP_SCREEN } = constants
const { CHARGEABLE, WAITING, INSPECTION } = statusConst

const Container = styled.View``

const Pressable = styled.Pressable`
	flex-direction: row;
	justify-content: space-between;
`

const TextView = styled.View`
	flex-direction: column;
	justify-content: center;
`

const Contents = styled.View``

const EmptyContents = styled.View`
	flex-direction: row;
	margin-top: ${verticalScale(8)}px;
	padding: ${verticalScale(40)}px ${horizontalScale(30)}px;
	background-color: ${theme.colors.white};
	align-items: center;
	justify-content: center;
	border-color: ${theme.colors.white};
	border-width: 1px;
	border-radius: ${moderateScale(5)}px;
`

const TouchableOpacity = styled.TouchableOpacity`
	padding: ${verticalScale(5)}px ${horizontalScale(5)}px;
`

const ChargeImage = styled.Image`
	width: ${moderateScale(28)}px;
	height: ${moderateScale(28)}px;
`

export default function MainNearbyChargingStation({ NextImg, getStationList }) {
	const scrollX = useRef(new Animated.Value(0)).current
	const navigation = useNavigation()
	const { state: stationState } = useStationContext()
	const { data: stationListData } = stationState.stationList
	const stationList = stationListData?.data || []

	useFocusEffect(
		useCallback(() => {
			getStationList()
		}, []),
	)

	const {
		index: { isFocused },
	} = navigation.getState()

	function truncate(str, length) {
		if (str) {
			const str2 = str.substring(0, length)
			let str3 = ''
			if (str.length > str2.length) {
				str3 = '...'
			} else {
				for (let i = 0; i < length - str.length; i++) {
					str3 += ' '
				}
			}

			return str2 + str3
		}
	}

	function getTimeToString(hours, minutes) {
		if (hours > 0) {
			return `${hours}시간 ${minutes}분`
		}

		return `${minutes}분`
	}

	return (
		<Container>
			<Pressable onPress={() => navigation.navigate(SEARCH_TAB_FLOW, { screen: CHARGING_STATION_SEARCH_SCREEN })}>
				<Left>
					<SmallText style={{ fontSize: moderateScale(16), fontFamily: theme.fonts.spoqaHanSansNeo.bold }}>
						가장 가까운 충전소
					</SmallText>
				</Left>
				<Right style={{ alignSelf: 'center' }}>
					<NextImg />
				</Right>
			</Pressable>

			<Animated.ScrollView
				style={styles.animatedView}
				horizontal
				// pagingEnabled
				snapToOffsets={[0, 96]}
				snapToEnd={false}
				onScroll={Animated.event(
					[
						{
							nativeEvent: {
								contentOffset: {
									x: scrollX,
								},
							},
						},
					],
					{
						useNativeDriver: true,
					},
				)}
				keyboardDismissMode="interactive"
				scrollEventThrottle={16}
				directionalLockEnabled
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
			>
				{stationList?.length > 0 &&
					stationList.map((item) => (
						<Contents style={styles.contents} key={item.stationId}>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate(SEARCH_TAB_FLOW, {
										screen: CHARGING_STATION_MAP_SCREEN,
										params: {
											stationId: item.stationId,
										},
									})
								}
							>
								<Row
									style={{
										marginTop: verticalScale(8),
										marginLeft: horizontalScale(8),
										marginRight: horizontalScale(8),
										marginBottom: verticalScale(8),
									}}
								>
									{item.status === WAITING ? (
										<View style={styles.icon}>
											<ChargeImage
												// 대기중
												source={require('@assets/icons/standby.png')}
											/>
										</View>
									) : item.status === CHARGEABLE ? (
										<View style={styles.icon}>
											<ChargeImage
												// 충전가능
												source={require('@assets/icons/thunder.png')}
											/>
										</View>
									) : item.status === INSPECTION ? (
										<View style={styles.icon}>
											<ChargeImage
												// 점검중
												source={require('@assets/icons/thunder_red.png')}
											/>
										</View>
									) : null}

									<TextView>
										<SmallText
											style={{
												...styles.textBox,
												color: isFocused ? theme.colors.notification : theme.colors.darkGray,
												...styles.fontSize16,
											}}
										>
											{truncate(item.name, 10)}
										</SmallText>
										<SmallText
											style={{
												color: isFocused ? theme.colors.notification : theme.colors.darkGray,
												...styles.textBox,
												...styles.fontSize16,
											}}
										>
											{`${
												item.distanceUnit === 'km'
													? item.distance.toFixed(2)
													: item.distance.toFixed(0)
											} ${item.distanceUnit}  |  ${getTimeToString(item.hours, item.minutes)}`}
										</SmallText>
									</TextView>
								</Row>
							</TouchableOpacity>
						</Contents>
					))}
			</Animated.ScrollView>
			{stationList.length < 1 && (
				<EmptyContents>
					<View style={styles.emptyIcon}>
						<ChargeImage
							// 충전가능
							source={require('@assets/icons/thunder.png')}
						/>
					</View>
					<SmallText>근처에 차밥 충전소가 없습니다.</SmallText>
				</EmptyContents>
			)}
		</Container>
	)
}

const styles = StyleSheet.create({
	animatedView: {
		backgroundColor: theme.colors.background,
	},
	contents: {
		backgroundColor: theme.colors.white,
		borderRadius: moderateScale(5),
		marginTop: verticalScale(8),
		marginRight: horizontalScale(10),
		width: moderateScale(220),
	},
	icon: {
		...Platform.select({
			ios: {
				marginTop: moderateScale(4),
			},
		}),
	},
	emptyIcon: {
		...Platform.select({
			ios: {
				marginBottom: verticalScale(4),
				marginRight: horizontalScale(2),
			},
			android: {
				marginBottom: verticalScale(2),
				marginRight: horizontalScale(2),
			},
		}),
	},
	textBox: {
		marginTop: Platform.OS === 'ios' ? verticalScale(10) : verticalScale(4),
		marginLeft: horizontalScale(8),
		marginBottom: verticalScale(8),
	},
	fontSize16: {
		fontSize: moderateScale(16),
	},
})
