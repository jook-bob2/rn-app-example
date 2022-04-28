import Left from '@/components/ui/view/Left'
import { theme } from '@/theme'
import React, { useCallback, useRef } from 'react'
import { Animated, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'
import { verticalScale, moderateScale, horizontalScale } from '@theme/scaling'
import Right from '@/components/ui/view/Right'
import SmallText from '@/components/ui/text/SmallText'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import constants from '@/navigations/constants'
import { useError } from '@/core/store/common/providers/ErrorProvider'
import { GET_PROMOTION_LIST_PAGE } from '@/core/store/api/create/promotionCreate'
import { usePromotionContext } from '@/core/store/api/providers/PromotionApiProvider'

const { MY_CHABAP_TAB_FLOW, NOTICE_EVENT_SCREEN } = constants

const Container = styled.View`
	padding-top: ${verticalScale(24)}px;
`

const Pressable = styled.Pressable`
	flex-direction: row;
	justify-content: space-between;
`

const Contents = styled.View`
	flex: 1;
	margin-right: ${horizontalScale(10)}px;
	padding-top: ${verticalScale(8)}px;
`

const EmptyContents = styled.View`
	margin-top: ${verticalScale(8)}px;
	padding: ${verticalScale(40)}px ${horizontalScale(30)}px;
	background-color: ${theme.colors.white};
	align-items: center;
	justify-content: center;
	border-color: ${theme.colors.white};
	border-width: 1px;
	border-radius: ${moderateScale(5)}px;
`

export default function MainEvent({ NextImg }) {
	const { navigate } = useNavigation()
	const scrollX = useRef(new Animated.Value(0)).current
	const { state: promotionState, dispatch: promotionDispatch } = usePromotionContext()
	const { data: promotionData } = promotionState.promotionList
	const eventList = promotionData?.data?.content || []
	const { $error } = useError()
	//console.log('=========> ', eventList)

	useFocusEffect(
		useCallback(() => {
			getEventList()
		}, []),
	)

	async function getEventList() {
		try {
			await GET_PROMOTION_LIST_PAGE(promotionDispatch, {
				page: 0,
				size: 10,
				platform: Platform.OS,
				filepath: 'event-main/',
				isEnd: false,
			})
		} catch (err) {
			console.log('event lsit error => ', err)
			const errData = err?.data
			if (errData?.code) {
				const { code, msg } = errData
				setTimeout(() => {
					$error({
						code,
						msg,
						onPress: (result) => {
							if (result) {
								getEventList()
							}
						},
					})
				}, 1000)
			}
		}
	}

	return (
		<Container>
			<Pressable onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: NOTICE_EVENT_SCREEN })}>
				<Left>
					<SmallText style={{ fontSize: moderateScale(16), fontFamily: theme.fonts.spoqaHanSansNeo.bold }}>
						이벤트&소식
					</SmallText>
				</Left>
				<Right style={{ alignSelf: 'center' }}>
					<NextImg />
				</Right>
			</Pressable>

			<Animated.ScrollView
				style={styles.animatedView}
				horizontal
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
				scrollEnabled={true}
				scrollToOverflowEnabled={false}
				indicatorStyle={'white'}
				keyboardDismissMode="interactive"
				scrollEventThrottle={16}
				directionalLockEnabled
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
			>
				{eventList.length > 0 &&
					eventList.map((item) => (
						<Contents key={item.id}>
							<TouchableOpacity
								onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: NOTICE_EVENT_SCREEN })}
							>
								<View style={styles.responsiveContainer}>
									<Image style={{ ...styles.responsiveImg }} source={{ uri: item.fileurl }} />
								</View>
							</TouchableOpacity>
						</Contents>
					))}
			</Animated.ScrollView>
			{eventList.length < 1 && (
				<EmptyContents>
					<SmallText>이벤트 정보가 없습니다.</SmallText>
				</EmptyContents>
			)}
		</Container>
	)
}

const styles = StyleSheet.create({
	animatedView: {
		backgroundColor: theme.colors.background,
	},
	responsiveContainer: {
		flex: 1,
		width: 260,
		height: 130,
	},
	responsiveImg: {
		width: '100%',
		height: '100%',
		aspectRatio: 260 / 130,
		marginLeft: 'auto',
		marginRight: 'auto',
		resizeMode: 'contain',
	},
})
