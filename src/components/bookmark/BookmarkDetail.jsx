import statusConst from '@/constants/statusConst'
import { GET_USER_STATION_LIST } from '@/core/store/api/create/stationCreate'
import { useStationContext } from '@/core/store/api/providers/StationApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useBackColor } from '@/core/store/common/providers/BackColorProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import useGeolocation from '@/hooks/useGeolocation'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { useNavigation, useRoute } from '@react-navigation/native'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import { CancelSvg, ExclamationGraySvg, SearchSvg, ThunderRedSvg, ThunderSvg } from '@util/svgUtil'
import React, { useEffect, useRef, useState } from 'react'
import {
	FlatList,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import styled from 'styled-components'
import Loading from '../ui/Loading'
import SmallText from '../ui/text/SmallText'

//const { BOOKMARK_DETAIL_SCREEN, BOOKMARK_MODIFY_SCREEN } = constants
const { BOOKMARK_CHARGING_STATION_MAP_SCREEN } = constants
const Container = styled.View`
	width: 100%;
	height: 85%;
	align-items: center;
	padding: ${moderateScale(24)}px;
`
const EmptyContainer = styled.View`
	width: 100%;
	height: 100%;
	padding-left: ${moderateScale(24)}px;
	padding-right: ${moderateScale(24)}px;
	padding-top: ${moderateScale(24)}px;
	background-color: ${theme.colors.background};
`

const BookmarkAddressItem = styled.View`
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white};
	margin-bottom: ${verticalScale(24)}px;
	padding: ${verticalScale(15)}px ${horizontalScale(10)}px;
	width: ${moderateScale(350)}px;
	flex-direction: row;
`
// const ChargeSpeedLabel = styled.View`
// 	background-color: ${({ count }) => (count > 0 ? theme.colors.turquoise : theme.colors.disabled)};
// 	border-color: ${({ count }) => (count > 0 ? theme.colors.turquoise : theme.colors.disabled)};
// 	border-width: ${horizontalScale(1)}px;
// 	border-radius: ${moderateScale(20)}px;
// 	padding: ${verticalScale(3)}px ${horizontalScale(10)}px;
// 	margin: 0 ${horizontalScale(5)}px;
// `
const Description = styled.View`
	flex: 1;
	padding: ${verticalScale(2)}px ${horizontalScale(10)}px;
`
const Input = styled.TextInput`
	padding-right: ${horizontalScale(24)}px;
	padding-left: ${horizontalScale(15)}px;
	margin-right: ${horizontalScale(30)}px;
	margin-left: ${horizontalScale(5)}px;
	margin-top: ${verticalScale(5)}px;
	color: ${theme.colors.text};
	background-color: ${theme.colors.white};
	height: ${verticalScale(40)}px;
`

const SearchViewInput = styled.View`
	position: absolute;
	align-self: flex-end;
	top: ${verticalScale(12)}px;
	right: ${horizontalScale(16)}px;
`
const SearchView = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	padding: 0px ${horizontalScale(24)}px;
	border-top-left-radius: ${moderateScale(16)}px;
	border-top-right-radius: ${moderateScale(16)}px;
`
const RemoveView = styled.View`
	position: absolute;
	align-self: flex-end;
	top: ${verticalScale(12)}px;
	right: ${horizontalScale(48)}px;
`

const { CHARGEABLE, WAITING, INSPECTION } = statusConst
export default function BookmarkDetail() {
	const [searchString, setSearchString] = useState('')
	const { navigate } = useNavigation()
	const { getLocation } = useGeolocation()
	const { $alert } = useAlert()
	const { state: userStationState, dispatch: userStationDispatch } = useStationContext()
	const [stationList, setStationList] = useState([])
	const enterRef = useRef()
	const [isKeyboardShow, setIsKeyboardShow] = useState(false)
	const { loading: userStationListLoading } = userStationState.userStationList
	//const stationList = stationListData?.data || []
	const {
		params: { isModify, nickName, favoriteId },
	} = useRoute()

	const {
		userState: { id: userId },
	} = useUser()
	const { setBottomColor } = useBackColor()

	useEffect(() => {
		const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
			setIsKeyboardShow(true)
		})
		const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			setIsKeyboardShow(false)
		})

		return () => {
			showSubscription.remove()
			hideSubscription.remove()
		}
	}, [])

	useEffect(() => {
		if (stationList.length > 0) {
			setTimeout(() => {
				setBottomColor(theme.colors.white)
			}, 0)
		} else {
			setTimeout(() => {
				setBottomColor(theme.colors.background)
			}, 0)
		}
	}, [stationList])

	// function handleModifyCarChargeStation() {
	// 	//	navigate(BOOKMARK_MODIFY_SCREEN)
	// }
	// function moveToChargingStationMap() {}
	// function getTimeToString(hours, minutes) {
	// 	if (hours > 0) {
	// 		return `${hours}시${minutes}분`
	// 	}

	// 	return `${minutes}분`
	// }
	async function getStationList() {
		if (searchString) {
			try {
				const loc = await getLocation()

				if (loc.code === 200) {
					const { latitude, longitude } = loc

					setTimeout(async () => {
						try {
							const response = await GET_USER_STATION_LIST(userStationDispatch, {
								userId,
								distance: 30,
								latitude,
								longitude,
								searchString,
							})
							console.log('response', response.data)
							if (response.data?.success) {
								// const { data: stationListData } = stationState.stationList
								setStationList(response?.data?.data || [])
							}
						} catch (err2) {
							console.log('station error => ', err2)
						}
					}, 0)
				}
			} catch (err) {
				console.log('get location error => ', err)
			}
		} else {
			$alert('주소를 입력하세요.')
		}
	}

	return (
		<>
			{userStationListLoading && <Loading />}
			{stationList.length > 0 ? (
				<>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
						<KeyboardAvoidingView
							style={{ flex: 1 }}
							behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
							keyboardVerticalOffset={
								Platform.OS === 'ios'
									? verticalScale(verticalScale(getStatusBarHeight()) + verticalScale(80))
									: verticalScale(verticalScale(getStatusBarHeight()) + verticalScale(72))
							}
						>
							<Container
								style={{
									height: !isKeyboardShow ? '80%' : '75%',
									backgroundColor: theme.colors.background,
								}}
							>
								<FlatList
									data={stationList}
									keyExtractor={(item) => item.stationId}
									showsVerticalScrollIndicator={false}
									showsHorizontalScrollIndicator={false}
									onScrollEndDrag={Keyboard.dismiss}
									renderItem={({ item }) => (
										<TouchableOpacity
											onPress={() =>
												navigate(BOOKMARK_CHARGING_STATION_MAP_SCREEN, {
													stationId: item.stationId,
													stationStatus: item.status,
													isModify: isModify,
													nickName: nickName,
													favoriteId: favoriteId,
												})
											}
										>
											<BookmarkAddressItem>
												{item.status === CHARGEABLE ? (
													<ThunderSvg
														style={{ ...theme.shadow(), ...styles.icon }}
														width={moderateScale(32)}
														height={moderateScale(32)}
													/>
												) : item.status === WAITING ? (
													<ThunderRedSvg
														style={{ ...theme.shadow(), ...styles.icon }}
														width={moderateScale(32)}
														height={moderateScale(32)}
													/>
												) : item.status === INSPECTION ? (
													<ExclamationGraySvg
														style={{ ...theme.shadow(), ...styles.icon }}
														width={moderateScale(32)}
														height={moderateScale(32)}
													/>
												) : null}
												<Description>
													<View
														style={{
															flexDirection: 'row',
															alignItems: 'center',
														}}
													>
														{/* <SmallText style={styles.boldText}>{item.bookName}</SmallText> */}
														<SmallText style={styles.boldText}>{item.name}</SmallText>
													</View>
													<View style={{ margin: moderateScale(5) }} />
													<View>
														<SmallText
															style={{
																color: theme.colors.darkGray,
																fontSize: moderateScale(16),
															}}
														>
															{item.addr1} {item.addr2}
														</SmallText>
														{/* <View style={{ margin: moderateScale(2) }} />
													<SmallText style={{ fontSize: moderateScale(14) }}>
														{`${item.distance.toFixed(2)} ${
															item.distanceUnit
														} | ${getTimeToString(item.hours, item.minutes)}`}
													</SmallText> */}
													</View>
													{/* <View style={{ flexDirection: 'row', marginTop: verticalScale(10) }}>
													{item.totalSlowChgCnt !== 0 ? (
														<ChargeSpeedLabel
															count={item.totalSlowChgCnt - item.usedSlowChgCnt}
														>
															<SmallText style={styles.labelText}>
																완속 {item.usedSlowChgCnt}/{item.totalSlowChgCnt}
															</SmallText>
														</ChargeSpeedLabel>
													) : null}
													{item.totalMediumChgCnt !== 0 ? (
														<ChargeSpeedLabel
															count={item.totalMediumChgCnt - item.usedMediumChgCnt}
														>
															<SmallText style={styles.labelText}>
																중속 {item.usedMediumChgCnt}/{item.totalMediumChgCnt}
															</SmallText>
														</ChargeSpeedLabel>
													) : null}
													{item.totalQuickChgCnt !== 0 ? (
														<ChargeSpeedLabel
															count={item.totalQuickChgCnt - item.usedQuickChgCnt}
														>
															<SmallText style={styles.labelText}>
																급속 {item.usedQuickChgCnt}/{item.totalQuickChgCnt}
															</SmallText>
														</ChargeSpeedLabel>
													) : null}

													{item.totalSlowChgCnt === 0 &&
													item.totalMediumChgCnt === 0 &&
													item.totalQuickChgCnt === 0 &&
													item.status === CHARGEABLE ? (
														<SmallText style={styles.chargeableText}>충전가능</SmallText>
													) : item.status === WAITING ? (
														<SmallText style={styles.waitingText}>대기중</SmallText>
													) : item.status === INSPECTION ? (
														<SmallText style={styles.inspectionText}>점검중</SmallText>
													) : null}
												</View> */}
												</Description>
											</BookmarkAddressItem>
										</TouchableOpacity>
									)}
								/>
							</Container>

							<SearchView style={styles.searchViewStyle}>
								<View
									style={{
										width: '100%',
										borderRadius: moderateScale(5),
										borderWidth: moderateScale(1),
										borderColor: '#dbdbdb',
										backgroundColor: theme.colors.white,
									}}
								>
									<Input
										style={styles.searchInputEmptyListStyle}
										placeholder="충전소 또는 주소 검색"
										placeholderTextColor={theme.colors.placeholder}
										autoFocus={true}
										isShadow={false}
										value={searchString}
										onChangeText={(text) => setSearchString(text)}
										childRef={enterRef}
										returnKeyType="done"
										onSubmitEditing={() => getStationList()}
									/>
									{searchString ? (
										<RemoveView style={{ bottom: moderateScale(15) }}>
											<TouchableOpacity
												// style={{
												// 	marginTop: verticalScale(15),
												// }}
												onPress={() => setSearchString('')}
											>
												<CancelSvg width={moderateScale(20)} height={moderateScale(20)} />
											</TouchableOpacity>
										</RemoveView>
									) : null}

									<SearchViewInput style={{ bottom: moderateScale(15) }}>
										<TouchableOpacity onPress={() => getStationList()}>
											<SearchSvg width={moderateScale(20)} height={moderateScale(20)} />
										</TouchableOpacity>
									</SearchViewInput>
								</View>
							</SearchView>
						</KeyboardAvoidingView>
					</TouchableWithoutFeedback>
				</>
			) : (
				<TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
					<EmptyContainer>
						<View
							style={{
								...theme.shadow(),
								backgroundColor: theme.colors.white,
								borderRadius: moderateScale(5),
							}}
						>
							<Input
								style={styles.searchInputStyle}
								placeholder="충전소 또는 주소 검색"
								placeholderTextColor={theme.colors.placeholder}
								autoFocus={true}
								value={searchString}
								isShadow={false}
								onChangeText={(text) => setSearchString(text)}
								childRef={enterRef}
								returnKeyType="done"
								blurOnSubmit={false}
								onSubmitEditing={() => getStationList()}
							/>
							{searchString ? (
								<RemoveView>
									<TouchableOpacity onPress={() => setSearchString('')}>
										<CancelSvg width={moderateScale(20)} height={moderateScale(20)} />
									</TouchableOpacity>
								</RemoveView>
							) : null}
							<SearchViewInput>
								<TouchableOpacity onPress={() => getStationList()}>
									<SearchSvg width={moderateScale(20)} height={moderateScale(20)} />
								</TouchableOpacity>
							</SearchViewInput>
						</View>
					</EmptyContainer>
				</TouchableWithoutFeedback>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	searchInputStyle: {
		width: Platform.OS === 'ios' ? horizontalScale(240) : horizontalScale(300),
	},
	searchViewStyle: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: {
					width: verticalScale(0),
					height: verticalScale(3),
				},
				shadowOpacity: moderateScale(0.2),
				shadowRadius: moderateScale(5),
			},
			android: {
				elevation: 1,
			},
		}),
		// marginTop: verticalScale(40),
		// backgroundColor: theme.colors.white,
		// width: '100%',
		// height: moderateScale(80),
	},
	searchInputEmptyListStyle: {
		width: Platform.OS === 'ios' ? horizontalScale(240) : horizontalScale(300),

		// height: verticalScale(50),
		// borderRadius: moderateScale(6),
		// marginTop: verticalScale(16),
		// height: verticalScale(50),
		// backgroundColor: theme.colors.white,
	},
	labelText: {
		color: theme.colors.white,
	},
	boldText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		fontSize: moderateScale(16),
	},
	icon: {
		...Platform.select({
			android: {
				borderRadius: moderateScale(16),
			},
		}),
	},
})
