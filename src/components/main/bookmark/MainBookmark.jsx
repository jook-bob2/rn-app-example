// import Paragraph from '@/components/ui/text/Paragraph'
// import SmallText from '@/components/ui/text/SmallText'
// import Left from '@/components/ui/view/Left'
// import Right from '@/components/ui/view/Right'
// import { theme } from '@/theme'
// import { useNavigation, useFocusEffect } from '@react-navigation/core'
// import React, { useRef, useCallback } from 'react'
// import { Animated, StyleSheet, TouchableOpacity } from 'react-native'
// import styled from 'styled-components/native'
// import constants from '@/navigations/constants'
// import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
// import { useUser } from '@core/store/common/providers/UserProvider'
// import { GET_FAVORITE_STATION_NORMAL_LIST } from '@/core/store/api/create/userFavoriteStationCreate'
// import { useUserFavoriteStationContext } from '@/core/store/api/providers/UserFavoriteStationApiProvider'

// const { SEARCH_TAB_FLOW, BOOKMARK_LIST_SCREEN, BOOKMARK_DETAIL_SCREEN } = constants

// const Container = styled.View`
// 	flex: 1;
// 	margin-top: ${verticalScale(10)}px;
// 	padding: ${moderateScale(10)}px;
// `

// const Pressable = styled.Pressable`
// 	flex-direction: row;
// 	justify-content: space-between;
// 	padding: ${moderateScale(10)}px;
// `

// const NextImg = styled.Image`
// 	width: ${moderateScale(20)}px;
// 	height: ${moderateScale(20)}px;
// 	background-color: ${theme.colors.white};
// 	tint-color: ${theme.colors.darkGray};
// `

// const Contents = styled.View`
// 	flex: 1;
// `

// const EmptyContents = styled.View`
// 	padding: ${verticalScale(20)}px ${horizontalScale(30)}px;
// `

// const ImageView = styled.View`
// 	flex-direction: row;
// 	justify-content: flex-end;
// 	padding: ${verticalScale(5)}px 0px ${verticalScale(5)}px 0px;
// `

// const BookmarkImage = styled.Image`
// 	width: ${moderateScale(14)}px;
// 	height: ${moderateScale(17)}px;
// 	tint-color: ${theme.colors.turquoise};
// `

// export default function MainBookmark() {
// 	const scrollX = useRef(new Animated.Value(0)).current
// 	const navigation = useNavigation()
// 	const {
// 		userState: { id: userId },
// 	} = useUser()
// 	const { state: ufsState, dispatch: ufsDispatch } = useUserFavoriteStationContext()
// 	const favoriteList = ufsState.favoriteStationNormalList?.data?.data || []

// 	const {
// 		index: { isFocused },
// 	} = navigation.getState()

// 	useFocusEffect(
// 		useCallback(() => {
// 			getFavoriteStationList()
// 		}, [userId]),
// 	)

// 	async function getFavoriteStationList() {
// 		if (userId) {
// 			try {
// 				await GET_FAVORITE_STATION_NORMAL_LIST(ufsDispatch, { userId })
// 			} catch (err) {
// 				console.log('favorite station list error => ', err)
// 			}
// 		}
// 	}

// 	return (
// 		<Container>
// 			<Pressable onPress={() => navigation.navigate(SEARCH_TAB_FLOW, { screen: BOOKMARK_LIST_SCREEN })}>
// 				<Left>
// 					<Paragraph style={{ color: theme.colors.darkGray }}>즐겨찾기</Paragraph>
// 				</Left>
// 				<Right>
// 					<NextImg source={require('@assets/icons/arrow_next.png')} />
// 				</Right>
// 			</Pressable>

// 			<Animated.ScrollView
// 				style={styles.animatedView}
// 				horizontal
// 				snapToOffsets={[0, 96]}
// 				snapToEnd={false}
// 				onScroll={Animated.event(
// 					[
// 						{
// 							nativeEvent: {
// 								contentOffset: {
// 									x: scrollX,
// 								},
// 							},
// 						},
// 					],
// 					{
// 						useNativeDriver: true,
// 					},
// 				)}
// 				scrollEnabled={true}
// 				scrollToOverflowEnabled={false}
// 				indicatorStyle={'white'}
// 				keyboardDismissMode="interactive"
// 				scrollEventThrottle={16}
// 				directionalLockEnabled
// 				showsVerticalScrollIndicator={false}
// 				showsHorizontalScrollIndicator={false}
// 			>
// 				{favoriteList?.length > 0 &&
// 					favoriteList.map((item, index) => (
// 						<Contents style={styles.contents} key={index}>
// 							<ImageView>
// 								<BookmarkImage source={require('@/assets/icons/bookmark_rank.png')} />
// 							</ImageView>
// 							<TouchableOpacity
// 								onPress={() =>
// 									navigation.navigate(SEARCH_TAB_FLOW, {
// 										screen: BOOKMARK_DETAIL_SCREEN,
// 										params: { favoriteId: item.favoriteId, stationId: item.stationId },
// 									})
// 								}
// 							>
// 								<SmallText
// 									style={{
// 										color: isFocused && theme.colors.notification,
// 									}}
// 								>
// 									{item.name}
// 								</SmallText>
// 							</TouchableOpacity>
// 						</Contents>
// 					))}
// 			</Animated.ScrollView>

// 			{favoriteList?.length < 1 && (
// 				<EmptyContents style={styles.emptyContents}>
// 					<SmallText>즐겨찾는 충전소가 없습니다.</SmallText>
// 				</EmptyContents>
// 			)}
// 		</Container>
// 	)
// }

// const styles = StyleSheet.create({
// 	animatedView: {
// 		backgroundColor: theme.colors.white,
// 	},
// 	contents: {
// 		backgroundColor: theme.colors.white,
// 		borderBottomWidth: horizontalScale(1),
// 		borderBottomColor: theme.colors.disabled,
// 		shadowColor: '#000',
// 		shadowOffset: {
// 			width: 0,
// 			height: verticalScale(5),
// 		},
// 		shadowOpacity: 0.29,
// 		shadowRadius: moderateScale(4.65),
// 		elevation: 5,
// 		padding: moderateScale(10),
// 		margin: moderateScale(5),
// 	},
// 	emptyContents: {
// 		backgroundColor: theme.colors.white,
// 		borderBottomWidth: horizontalScale(1),
// 		borderBottomColor: theme.colors.disabled,
// 		borderRadius: moderateScale(20),
// 		shadowColor: '#000',
// 		shadowOffset: {
// 			width: 0,
// 			height: verticalScale(5),
// 		},
// 		shadowOpacity: 0.29,
// 		shadowRadius: moderateScale(4.65),
// 		elevation: 5,
// 		margin: moderateScale(7),
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 	},
// })
