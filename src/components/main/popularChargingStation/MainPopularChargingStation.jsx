import Paragraph from '@/components/ui/text/Paragraph'
import SmallText from '@/components/ui/text/SmallText'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import { theme } from '@/theme'
import { useNavigation } from '@react-navigation/core'
import React, { useRef, useState } from 'react'
import { Animated, StyleSheet, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import constants from '@/navigations/constants'
import Row from '@/components/ui/view/Row'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'

const { SEARCH_TAB_FLOW, CHARGING_STATION_POPULAR_SCREEN, CHARGING_STATION_DETAIL_SCREEN } = constants

const Container = styled.View`
	margin-top: ${verticalScale(10)}px;
	padding: ${moderateScale(10)}px;
`

const NextImg = styled.Image`
	width: ${moderateScale(20)}px;
	height: ${moderateScale(20)}px;
	background-color: ${theme.colors.white};
	tint-color: ${theme.colors.darkGray};
`

const Contents = styled.View``

const EmptyContents = styled.View`
	padding: ${verticalScale(20)}px ${horizontalScale(30)}px;
`

const ImageView = styled.View`
	padding: ${verticalScale(3)}px ${horizontalScale(10)}px ${verticalScale(3)}px ${horizontalScale(5)}px;
`

const Image = styled.Image`
	width: ${moderateScale(14)}px;
	height: ${moderateScale(14)}px;
	tint-color: ${theme.colors.darkGray};
`

const Pressable = styled.Pressable`
	flex-direction: row;
	justify-content: space-between;
	padding: ${moderateScale(10)}px;
`

const DATA = []
for (let i = 0; i < 10; i++) {
	DATA.push(i)
}

export default function MainPopularChargingStation() {
	const scrollX = useRef(new Animated.Value(0)).current
	const navigation = useNavigation()
	const [chargeState] = useState(0)

	const {
		index: { isFocused },
	} = navigation.getState()

	return (
		<Container>
			<Pressable
				onPress={() => navigation.navigate(SEARCH_TAB_FLOW, { screen: CHARGING_STATION_POPULAR_SCREEN })}
			>
				<Left>
					<Paragraph style={{ color: theme.colors.darkGray }}>인기 차밥 충전소</Paragraph>
				</Left>
				<Right>
					<NextImg source={require('@assets/icons/arrow_next.png')} />
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
				{DATA.length > 0 &&
					DATA.map((item) => (
						<Contents style={styles.contents} key={item}>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate(SEARCH_TAB_FLOW, { screen: CHARGING_STATION_DETAIL_SCREEN })
								}
							>
								<Row style={{ ...styles.center, paddingBottom: verticalScale(10) }}>
									<ImageView>
										<Image source={require('@/assets/icons/place.png')} />
									</ImageView>
									<SmallText
										style={{
											color: isFocused && theme.colors.notification,
										}}
									>
										{'차밥거리 주차장 E' + item}
									</SmallText>
								</Row>
								<Row style={{ ...styles.center, paddingBottom: verticalScale(10) }}>
									<ImageView>
										<Image source={require('@/assets/icons/car.png')} />
									</ImageView>
									<SmallText
										style={{
											color: isFocused && theme.colors.notification,
										}}
									>
										{'491 m | 10분'}
									</SmallText>
								</Row>
								<Row style={styles.center}>
									<ImageView>
										<Image source={require('@/assets/icons/clock.png')} />
									</ImageView>
									<SmallText
										style={{
											color: isFocused
												? theme.colors.notification
												: !isFocused && chargeState === 0
												? theme.colors.text
												: !isFocused && chargeState === 1
												? theme.colors.turquoise
												: theme.colors.darkGray,
											fontWeight: 'bold',
										}}
									>
										{chargeState === 1 ? '충전가능' : chargeState === 0 ? '대기중' : ''}
									</SmallText>
								</Row>
							</TouchableOpacity>
						</Contents>
					))}
			</Animated.ScrollView>
			{DATA.length < 1 && (
				<EmptyContents style={styles.emptyContents}>
					<SmallText>인기 차밥충전소가 없습니다.</SmallText>
				</EmptyContents>
			)}
		</Container>
	)
}

const styles = StyleSheet.create({
	animatedView: {
		backgroundColor: theme.colors.white,
	},
	contents: {
		backgroundColor: theme.colors.white,
		borderBottomWidth: horizontalScale(1),
		borderBottomColor: theme.colors.disabled,
		borderRadius: moderateScale(10),
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(5),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(4.65),
		elevation: 5,
		padding: moderateScale(10),
		margin: moderateScale(5),
	},
	center: {
		alignItems: 'center',
	},
	padding: {
		padding: moderateScale(20),
	},
	emptyContents: {
		backgroundColor: theme.colors.white,
		borderBottomWidth: horizontalScale(1),
		borderBottomColor: theme.colors.disabled,
		borderRadius: moderateScale(20),
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(5),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(4.65),
		elevation: 5,
		margin: moderateScale(7),
		alignItems: 'center',
		justifyContent: 'center',
	},
})
