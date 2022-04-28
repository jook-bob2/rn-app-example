import Loading from '@/components/ui/Loading'
import { GET_STATION_DETAIL } from '@/core/store/api/create/stationCreate'
import { POST_BOOK_MARK_INSERT } from '@/core/store/api/create/userFavoriteStationCreate'
import { useStationContext } from '@/core/store/api/providers/StationApiProvider'
import { useUserFavoriteStationContext } from '@/core/store/api/providers/UserFavoriteStationApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
//import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import useGeolocation from '@/hooks/useGeolocation'
import NaverMapView, { Align, Marker } from '@/map'
import constants from '@/navigations/constants'
//import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { nicknameValidator } from '@/utils/validator'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/core'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React, { useCallback, useRef, useState } from 'react'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'
// import constants from '@/navigations/constants'
import SmallText from '../ui/text/SmallText'
import Row from '../ui/view/Row'
import BookmarkAddressModal from './bookmarkModal/BookmarkAddressModal'

//const { MAIN_TAB_FLOW, MAIN_SCREEN } = constants

const ScrollView = styled.ScrollView`
	background-color: ${theme.colors.background};
`

const MapView = styled.View`
	height: ${Dimensions.get('window').height / 2.5}px;
`

const Container = styled.View`
	background-color: '#f8f8fa';
	padding: ${moderateScale(22)}px;
`

const SearchView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white};
	padding: ${verticalScale(15)}px ${horizontalScale(10)}px;
	margin-bottom: ${verticalScale(10)}px;
`

const Contents = styled.View`
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white};
	margin-bottom: ${verticalScale(18)}px;
	padding: ${moderateScale(16)}px;
`

const ChargerCntView = styled.View`
	flex: 0.3;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(24)}px;
	border-color: ${theme.colors.white};
	padding: ${moderateScale(10)}px;
`

const RowView = styled.View`
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: ${verticalScale(12)}px;
`

const ButtonView = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	align-self: center;
	width: 80%;
	height: ${verticalScale(55)}px;
	background-color: ${theme.colors.turquoise};
	border-color: ${theme.colors.white};
	border-radius: ${moderateScale(8)}px;
	border-width: ${moderateScale(1)}px;
	flex-direction: row;
	margin-bottom: ${verticalScale(40)}px;
`

export default function BookmarkChargingSationMap() {
	const { reset } = useNavigation()
	const { getLocation } = useGeolocation()
	// NAVER MAP API
	const mapView = useRef(null)
	const [enableLayerGroup, setEnableLayerGroup] = useState(true)
	const [loc, setLoc] = useState({
		latitude: 0,
		longitude: 0,
	})
	const { BOOKMARK_LIST_SCREEN } = constants
	const [isAddressOpen, setIsAddressOpen] = useState(false)
	//const { $alert } = useAlert()
	// const [bookmark, setBookmark] = useState(false)
	const [placeName, setPlaceName] = useState('')
	const { $alert } = useAlert()
	const { state: stationState, dispatch: stationDispatch } = useStationContext()
	const { data: stationDetailData } = stationState.stationDetail
	const stationDetail = stationDetailData?.data
	const { state: bookmarkedState, dispatch: bookmarkDispatch } = useUserFavoriteStationContext()
	const { loading: bookmarkedLoading } = bookmarkedState.bookmarkInsert
	//const [useModify, setUseModify] = useState(true)
	// user state
	const {
		userState: { id: userId, defaultUserEvId },
	} = useUser()
	// query parameter
	const {
		params: { stationId, stationStatus, isModify, nickName, favoriteId },
	} = useRoute()

	// charge api request
	const [chargeRequest, setChargeRequest] = useState({
		userId: 0,
		userEvId: 0,
		stationId: 0,
		chargeSpeed: '',
	})

	// initial set chargeRequest
	useFocusEffect(
		useCallback(() => {
			setChargeRequest({
				...chargeRequest,
				userId,
				userEvId: defaultUserEvId,
				stationId,
			})
		}, [userId, defaultUserEvId, stationId]),
	)

	useFocusEffect(
		useCallback(() => {
			getStationDetail()
		}, [stationId]),
	)

	useFocusEffect(
		useCallback(() => {
			if (stationDetail.latitude !== 0 && stationDetail.longitude !== 0) {
				setLoc({
					...loc,
					latitude: stationDetail.latitude,
					longitude: stationDetail.longitude,
				})
			}
		}, [stationDetail]),
	)

	async function getStationDetail() {
		try {
			const location = await getLocation()
			if (location.code === 200) {
				const { latitude, longitude } = location
				try {
					const response = await GET_STATION_DETAIL(stationDispatch, {
						userId,
						stationId,
						latitude,
						longitude,
					})
					if (response.data?.success) {
						console.log(response.data)
					}
				} catch (err2) {
					console.log('station detail error => ', err2)
				}
			}
		} catch (err) {
			console.log('get location error => ', err)
		}
	}

	function getTimeToString(hours, minutes) {
		if (hours > 0) {
			return `${hours}시${minutes}분`
		}
		return `${minutes}분`
	}

	async function handleBookMark() {
		if (placeName) {
			if (toastHandler()) {
				try {
					const response = await POST_BOOK_MARK_INSERT(bookmarkDispatch, {
						userId: userId,
						stationId: stationId,
						nickName: placeName,
					})
					const resData = response.data
					if (resData.data === true) {
						setTimeout(() => {
							reset({ routes: [{ name: BOOKMARK_LIST_SCREEN }] })
						}, 1000)
					} else {
						$alert(resData.data.msg)
					}
					console.log(resData.data)
				} catch (e) {
					console.log('error : ', e)
				}
			}
		} else {
			$alert('명칭을 입력해주세요')
		}
	}

	//Toast 핸들러
	function toastHandler() {
		const nickNameError = nicknameValidator(placeName)
		if (nickNameError) {
			$alert(nickNameError)
			return false
		}
		return true
	}

	function handleModify(addr1, addr2) {
		const addrText = addr1 + addr2
		console.log(addrText)
		reset({
			routes: [
				{
					name: BOOKMARK_LIST_SCREEN,
					params: {
						useModal: true,
						nickName: nickName,
						addrName: addrText,
						favoriteId: favoriteId,
						stationId: stationId,
					},
				},
			],
		})
		console.log('succes')
	}
	return (
		<>
			<ScrollView>
				<MapView>
					<NaverMapView
						ref={mapView}
						style={{ width: '100%', height: '100%' }}
						showsMyLocationButton={true}
						center={{ ...loc, zoom: 16 }}
						onTouch={(e) => console.log('onTouch', JSON.stringify(e.nativeEvent))}
						onCameraChange={(e) => console.log('onCameraChange', JSON.stringify(e))}
						onMapClick={(e) => console.log('onMapClick', JSON.stringify(e))}
						useTextureView
					>
						<Marker
							coordinate={loc}
							onClick={() => {
								console.warn('onClick! p0')
								mapView.current.setLayerGroupEnabled('bike', enableLayerGroup)
								mapView.current.setLayerGroupEnabled('transit', enableLayerGroup)
								setEnableLayerGroup(!enableLayerGroup)
							}}
							caption={{ text: stationDetail.name, align: Align.Bottom }}
						/>
					</NaverMapView>
				</MapView>

				<Container>
					<SearchView style={theme.shadow()}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<View style={{ margin: moderateScale(5) }} />
							<SmallText style={styles.boldText}>{stationDetail.name}</SmallText>
						</View>
					</SearchView>

					<Contents style={theme.shadow()}>
						<RowView>
							<SmallText style={{ ...styles.nameText }}>주소</SmallText>
							<View style={{ alignItems: 'flex-end' }}>
								<SmallText style={{ ...styles.valueText }}>{stationDetail?.addr1}</SmallText>
								<SmallText style={styles.valueText}>{stationDetail.addr2}</SmallText>
							</View>
						</RowView>
						<RowView>
							<SmallText style={styles.nameText}>거리</SmallText>
							<Row>
								<SmallText style={styles.valueText}>
									{stationDetail?.distanceUnit === 'km'
										? stationDetail?.distance.toFixed(2)
										: stationDetail?.distance.toFixed(0)}
									{stationDetail?.distanceUnit}
								</SmallText>
								<SmallText
									style={{
										marginLeft: moderateScale(16),
										marginRight: moderateScale(16),
										color: '#707070',
									}}
								>
									|
								</SmallText>
								<SmallText style={styles.valueText}>
									{getTimeToString(stationDetail?.hours, stationDetail?.minutes)}
								</SmallText>
							</Row>
						</RowView>
						<RowView>
							<SmallText style={styles.nameText}>운영시간</SmallText>
							<SmallText style={styles.valueText}>
								{stationDetail?.oprtnStartTime} ~ {stationDetail?.oprtnEndTime}
							</SmallText>
						</RowView>
						<RowView>
							<SmallText style={styles.nameText}>단가</SmallText>
							<View>
								<SmallText style={styles.valueText}>완속 : {stationDetail.slowChgPrice} 원</SmallText>
								<SmallText style={{ ...styles.valueText, paddingTop: moderateScale(4) }}>
									중속 : {stationDetail?.mediumChgPrice} 원
								</SmallText>
								<SmallText style={{ ...styles.valueText, paddingTop: moderateScale(4) }}>
									급속 : {stationDetail?.quickChgPrice} 원
								</SmallText>
							</View>
						</RowView>
					</Contents>

					<Contents style={theme.shadow()}>
						<RowView>
							<SmallText style={styles.boldText}>지원 충전기 타입</SmallText>
						</RowView>
						<RowView style={{ padding: moderateScale(10) }}>
							<ChargerCntView style={theme.shadow(2)}>
								<SmallText style={styles.nameText}>완속{'  '}</SmallText>
								<SmallText style={styles.chargeCntText}>{stationDetail.totalSlowChgCnt}</SmallText>
								<SmallText style={styles.nameText}>개</SmallText>
							</ChargerCntView>
							<ChargerCntView style={theme.shadow(2)}>
								<SmallText style={styles.nameText}>중속{'  '}</SmallText>
								<SmallText style={styles.chargeCntText}>{stationDetail.totalMediumChgCnt}</SmallText>
								<SmallText style={styles.nameText}>개</SmallText>
							</ChargerCntView>
							<ChargerCntView style={theme.shadow(2)}>
								<SmallText style={styles.nameText}>급속{'  '}</SmallText>
								<SmallText style={styles.chargeCntText}>{stationDetail.totalQuickChgCnt}</SmallText>
								<SmallText style={styles.nameText}>개</SmallText>
							</ChargerCntView>
						</RowView>
					</Contents>

					<Contents style={theme.shadow()}>
						<RowView>
							<SmallText style={styles.boldText}>차밥 이용 유의사항</SmallText>
						</RowView>

						<RowView>
							<SmallText style={styles.valueText}>
								Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
								has been the industrys standard dummy text ever since the 1500s, when an unknown printer
								took a galley of type and scrambled it to make a type specimen book. It has survived not
								only five centuries, but also the leap into electronic typesetting, remaining
								essentially unchanged.
							</SmallText>
						</RowView>
					</Contents>

					{isAddressOpen && (
						<>
							{bookmarkedLoading && <Loading />}
							<BookmarkAddressModal
								isAddressOpen={isAddressOpen}
								setIsAddressOpen={setIsAddressOpen}
								handleApplyPlaceName={() => handleBookMark()}
								title={stationDetail.name}
								placeName={placeName}
								setPlaceName={setPlaceName}
								status={stationStatus}
								subTitle={
									<SmallText style={styles.valueText}>
										{stationDetail.addr1} {stationDetail.addr2}
									</SmallText>
								}
							/>
						</>
					)}
				</Container>
			</ScrollView>
			<ButtonView
				onPress={
					isModify
						? () => setIsAddressOpen(true)
						: () => handleModify(stationDetail.addr1, stationDetail.addr2)
				}
			>
				<SmallText style={styles.buttonText}>이 주소로 선택</SmallText>
			</ButtonView>
		</>
	)
}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(5),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(4.65),
		elevation: 2,
	},
	boldText: {
		fontSize: moderateScale(18),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	buttonText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		fontSize: moderateScale(16),
		color: theme.colors.white,
	},
	nameText: {
		color: theme.colors.text,
		fontSize: moderateScale(15),
	},
	valueText: {
		color: theme.colors.darkGray,
		fontSize: moderateScale(15),
	},
	chargeCntText: {
		color: theme.colors.turquoise,
	},
	icon: {
		marginRight: horizontalScale(10),
		...Platform.select({
			android: {
				borderRadius: moderateScale(20),
			},
		}),
	},
})
