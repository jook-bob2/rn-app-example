import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components/native'
import { Keyboard, Platform, StyleSheet, View, Animated } from 'react-native'
import { theme } from '@/theme'
import SmallText from '../ui/text/SmallText'
import constants from '@/navigations/constants'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import useGeolocation from '@/hooks/useGeolocation'
import { useStationContext } from '@/core/store/api/providers/StationApiProvider'
import { GET_STATION_LIST } from '@/core/store/api/create/stationCreate'
import { useUserFavoriteStationContext } from '@/core/store/api/providers/UserFavoriteStationApiProvider'
import { GET_FAVORITE_STATION_NORMAL_LIST } from '@/core/store/api/create/userFavoriteStationCreate'
import { useUser } from '@/core/store/common/providers/UserProvider'
import statusConst from '@/constants/statusConst'
import { ExclamationGraySvg, ArrowNextSvg, PlusSvg } from '@util/svgUtil'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import TextInput from '../ui/input/TextInput'

const { CHARGEABLE, WAITING, INSPECTION } = statusConst

const { SEARCH_TAB_FLOW, CHARGING_STATION_MAP_SCREEN, BOOKMARK_LIST_SCREEN } = constants

const Container = styled.View`
	flex: 1;
	background-color: #f8f8fa;
	padding: ${moderateScale(18)}px ${horizontalScale(18)}px ${verticalScale(5)}px;
`

const EmptyView = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`

const ScrollView = styled.ScrollView`
	padding: ${moderateScale(5)}px;
`

const Contents = styled.TouchableOpacity`
	flex-direction: row;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white};
	padding: ${verticalScale(15)}px ${horizontalScale(10)}px;
	margin: ${verticalScale(5)}px 0 ${verticalScale(10)}px;
`

const ChargeSpeedLabel = styled.View`
	background-color: ${({ count }) => (count > 0 ? theme.colors.turquoise : theme.colors.disabled)};
	border-color: ${({ count }) => (count > 0 ? theme.colors.turquoise : theme.colors.disabled)};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(20)}px;
	padding: ${verticalScale(3)}px ${horizontalScale(10)}px;
	margin: 0 ${horizontalScale(5)}px;
`

const SearchView = styled.View`
	justify-content: center;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(0.5)}px;
	border-top-start-radius: ${moderateScale(15)}px;
	border-top-end-radius: ${moderateScale(15)}px;
	border-width: ${moderateScale(1)}px;
	border-color: ${theme.colors.white};
	padding: ${moderateScale(15)}px;
`

const Description = styled.View`
	flex: 1;
	padding: 0px ${horizontalScale(10)}px;
`

const BookmarkButtonView = styled.View`
	align-items: center;
	justify-content: center;
	padding: ${moderateScale(5)}px;
`

const BookmarkButton = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(25)}px;
	border-color: ${theme.colors.white};
	padding: ${verticalScale(2.5)}px ${horizontalScale(18)}px ${verticalScale(2.5)}px ${horizontalScale(5)}px;
	margin-right: ${horizontalScale(10)}px;
`

const BookmarkAddButton = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(30)}px;
	border-color: ${theme.colors.white};
	padding: ${moderateScale(10)}px;
`

const InputView = styled.View`
	flex-direction: row;
	justify-content: space-between;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: ${theme.colors.disabled};
`

const Image = styled.Image`
	width: ${moderateScale(35)}px;
	height: ${moderateScale(35)}px;
`

export default function ChargingStationSearch() {
	const { $alert } = useAlert()
	const { navigate } = useNavigation()
	const { getLocation } = useGeolocation()
	// station api
	const { state: stationState, dispatch: stationDispatch } = useStationContext()
	const { data: stationListData } = stationState.stationList
	const stationList = stationListData?.data || []
	// favorite api
	const { state: favoriteState, dispatch: favoriteDispatch } = useUserFavoriteStationContext()
	const { data: favoriteListData } = favoriteState.favoriteStationNormalList
	const favoriteList = favoriteListData?.data || []
	// user context
	const {
		userState: { id: userId },
	} = useUser()
	// etc state
	const scrollX = useRef(new Animated.Value(0)).current
	const [searchString, setSearchString] = useState('')
	const [keyboardHeight, setKeyboardHeight] = useState(0)

	useFocusEffect(
		useCallback(() => {
			getStationList()

			if (userId) getFavoriteList()
		}, []),
	)

	useFocusEffect(
		useCallback(() => {
			const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
				Platform.OS === 'ios'
					? setKeyboardHeight(Math.ceil(e.endCoordinates.height) + 10)
					: setKeyboardHeight(0)
			})
			const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
				setKeyboardHeight(0)
			})

			return () => {
				showSubscription.remove()
				hideSubscription.remove()
			}
		}, []),
	)

	async function getStationList() {
		try {
			const loc = await getLocation()
			if (loc.code === 200) {
				const { latitude, longitude } = loc
				try {
					const response = await GET_STATION_LIST(stationDispatch, {
						userId,
						distance: 500,
						latitude,
						longitude,
						searchString,
					})
					const resData = response.data
					if (resData?.success) {
						return resData.data
					}
				} catch (err2) {
					console.log('station error => ', err2)
				}
			}
		} catch (err) {
			console.log('get location error => ', err)
		}
	}

	async function getFavoriteList() {
		try {
			const response = await GET_FAVORITE_STATION_NORMAL_LIST(favoriteDispatch, { userId })
			if (response.data?.success) {
				// console.log(response.data.data)
			}
		} catch (error) {
			console.log(error)
		}
	}

	// 충전소 검색 버튼 클릭
	function handlePressSearch() {
		if (validationCheck()) {
			getStationList().then((res) => {
				if (res.length < 1) {
					$alert(`${searchString}와(과) 일치하는 검색결과가 없습니다.`)
				}
			})
		}
	}

	function validationCheck() {
		if (!searchString || searchString.replaceAll(' ', '') === '') {
			$alert('검색할 단어를 입력하세요.')
			return false
		}

		return true
	}

	function getTimeToString(hours, minutes) {
		if (hours > 0) {
			return `${hours}시${minutes}분`
		}

		return `${minutes}분`
	}

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

	return (
		<>
			<Container>
				{/* Contents View */}
				{stationList.length > 0 ? (
					<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 0.7 }}>
						{stationList.map((item) => (
							<Contents
								style={styles.shadow}
								key={item.stationId}
								onPress={() =>
									navigate(SEARCH_TAB_FLOW, {
										screen: CHARGING_STATION_MAP_SCREEN,
										params: {
											stationId: item.stationId,
										},
									})
								}
							>
								<View>
									{item.status === CHARGEABLE ? (
										<Image source={require('@assets/icons/thunder.png')} />
									) : item.status === WAITING ? (
										<Image source={require('@assets/icons/thunder_red.png')} />
									) : item.status === INSPECTION ? (
										<Image source={require('@assets/icons/exclamation.png')} />
									) : null}
								</View>

								<Description>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'space-between',
										}}
									>
										<SmallText style={styles.boldText}>{item.name}</SmallText>
										<ArrowNextSvg width={moderateScale(10)} height={moderateScale(10)} />
									</View>
									<View style={{ margin: moderateScale(5) }} />
									<View>
										<SmallText style={{ color: '#292929' }}>
											{item.addr1} {item.addr2}
										</SmallText>
										<View style={{ margin: moderateScale(2) }} />
										<SmallText style={{ color: '#797979' }}>
											{`${item.distance.toFixed(2)} ${item.distanceUnit} | ${getTimeToString(
												item.hours,
												item.minutes,
											)}`}
										</SmallText>
									</View>

									<View style={{ flexDirection: 'row', marginTop: verticalScale(10) }}>
										{item.totalSlowChgCnt !== 0 ? (
											<ChargeSpeedLabel count={item.totalSlowChgCnt - item.usedSlowChgCnt}>
												<SmallText style={styles.labelText}>
													완속 {item.usedSlowChgCnt}/{item.totalSlowChgCnt}
												</SmallText>
											</ChargeSpeedLabel>
										) : null}
										{item.totalMediumChgCnt !== 0 ? (
											<ChargeSpeedLabel count={item.totalMediumChgCnt - item.usedMediumChgCnt}>
												<SmallText style={styles.labelText}>
													중속 {item.usedMediumChgCnt}/{item.totalMediumChgCnt}
												</SmallText>
											</ChargeSpeedLabel>
										) : null}
										{item.totalQuickChgCnt !== 0 ? (
											<ChargeSpeedLabel count={item.totalQuickChgCnt - item.usedQuickChgCnt}>
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
									</View>
								</Description>
							</Contents>
						))}
					</ScrollView>
				) : (
					<EmptyView>
						<ExclamationGraySvg width={moderateScale(38)} height={moderateScale(38)} />
						<View style={{ margin: moderateScale(12) }} />
						<SmallText style={styles.emptyText}>근처에 차밥존이 없습니다.</SmallText>
					</EmptyView>
				)}
			</Container>

			<SearchView style={[styles.searchShadow, { marginBottom: verticalScale(keyboardHeight) }]}>
				<View style={{ marginBottom: verticalScale(8) }}>
					<Animated.ScrollView
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
						keyboardDismissMode="interactive"
						scrollEventThrottle={16}
						directionalLockEnabled
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
					>
						{favoriteList.length > 0 &&
							favoriteList.map((item) => (
								<BookmarkButtonView key={item.favoriteId}>
									<BookmarkButton
										style={styles.shadow}
										onPress={() =>
											navigate(SEARCH_TAB_FLOW, {
												screen: CHARGING_STATION_MAP_SCREEN,
												params: {
													stationId: item.stationId,
												},
											})
										}
									>
										<Image source={require('@assets/icons/star.png')} />
										<View style={{ margin: moderateScale(2.5) }} />
										<SmallText>{truncate(item.nickName, 7)}</SmallText>
									</BookmarkButton>
								</BookmarkButtonView>
							))}

						<BookmarkButtonView>
							<BookmarkAddButton
								style={styles.shadow}
								onPress={() =>
									navigate(SEARCH_TAB_FLOW, {
										screen: BOOKMARK_LIST_SCREEN,
										params: { useModal: false },
									})
								}
							>
								<PlusSvg width={moderateScale(15)} height={moderateScale(15)} />
							</BookmarkAddButton>
						</BookmarkButtonView>
						{/* {userId ? ('') : null} */}
					</Animated.ScrollView>
				</View>

				<View style={{ marginTop: verticalScale(8) }}>
					<InputView>
						<TextInput
							type={'search'}
							placeholder="주소를 검색하세요."
							style={styles.textInput}
							secureTextEntry={false}
							value={searchString}
							isShadow={false}
							onChangeText={(text) => setSearchString(text)}
							setRemoveText={() => setSearchString('')}
							setSearchText={() => handlePressSearch()}
							onSubmitEditing={() => handlePressSearch()}
							returnKeyType="done"
						/>
					</InputView>
				</View>
			</SearchView>
		</>
	)
}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(1),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(0.5),
		elevation: 1,
	},
	searchShadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(-0.2),
		},
		shadowOpacity: 0.15,
		shadowRadius: moderateScale(0.5),
		elevation: 1,
	},
	userTypeLabel: {
		flex: 0.25,
		alignItems: 'center',
		backgroundColor: theme.colors.white,
		borderWidth: verticalScale(2),
		borderRadius: moderateScale(22),
		borderColor: theme.colors.turquoise,
	},
	verticalBar: {
		flex: 0.05,
		height: '100%',
		borderLeftWidth: verticalScale(1.5),
		borderColor: theme.colors.disabled,
	},
	boldText: {
		fontWeight: 'bold',
		fontSize: moderateScale(15),
	},
	labelText: {
		fontWeight: 'bold',
		color: 'white',
	},
	chargeableText: {
		fontWeight: 'bold',
		color: theme.colors.turquoise,
	},
	waitingText: {
		fontWeight: 'bold',
		color: '#ff0000',
	},
	inspectionText: {
		fontWeight: 'bold',
		color: '#999999',
	},
	emptyText: {
		fontWeight: 'bold',
		fontSize: moderateScale(15),
	},
})
