import Checkbox from '@/components/ui/checkbox/Checkbox'
import Modal from '@/components/ui/modal/Modal'
import statusConst from '@/constants/statusConst'
import {
	GET_FIND_ROAD_REQ_DATA,
	GET_STATION_DETAIL,
	GET_STATION_WAITING,
	POST_STATION_CHARGE,
} from '@/core/store/api/create/stationCreate'
import { POST_TOGGLE_BOOK_MARK } from '@/core/store/api/create/userFavoriteStationCreate'
import { useStationContext } from '@/core/store/api/providers/StationApiProvider'
import { useUserFavoriteStationContext } from '@/core/store/api/providers/UserFavoriteStationApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useConnector } from '@/core/store/common/providers/ConnectorStatusProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import useGeolocation from '@/hooks/useGeolocation'
import NaverMapView, { Align, Marker } from '@/map'
import { kakaoMapOpen, nmapOpen, tMapOpen } from '@/map/navigationOpen'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/core'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React, { useCallback, useRef, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'
import TextInput from '../ui/input/TextInput'
import SmallText from '../ui/text/SmallText'

const { CHARGEABLE } = statusConst

const { MAIN_TAB_FLOW, MAIN_SCREEN, MY_CHABAP_TAB_FLOW, MY_CHABAP_CHARGE_HISTORY_SCREEN } = constants

const ScrollView = styled.ScrollView`
	flex: 1;
	background-color: #f8f8fa;
`

const MapView = styled.View`
	height: ${Dimensions.get('window').height / 2.5}px;
`

const Container = styled.View`
	flex: 1;
	background-color: '#f8f8fa';
	padding: ${moderateScale(24)}px;
`

const SearchView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white};
	padding: ${moderateScale(10)}px;
	margin-bottom: ${verticalScale(10)}px;
`

const Contents = styled.View`
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white};
	margin-bottom: ${verticalScale(18)}px;
	padding: ${moderateScale(15)}px;
`

const ChargerCntView = styled.View`
	flex: 0.3;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(15)}px;
	border-color: ${theme.colors.white};
	padding: ${moderateScale(10)}px;
`

const ChargeTypeView = styled.View`
	flex: 0.3;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(15)}px;
	border-color: ${theme.colors.white};
	padding: ${verticalScale(22)}px 0;
`

const Image = styled.Image`
	width: ${moderateScale(35)}px;
	height: ${moderateScale(35)}px;
`

const CheckBoxImage = styled.Image`
	width: ${moderateScale(15)}px;
	height: ${moderateScale(15)}px;
	tint-color: ${({ tintColor }) => (tintColor ? tintColor : theme.colors.placeholder)};
`

const RowView = styled.View`
	flex-direction: row;
	justify-content: space-between;
	margin: ${moderateScale(5)}px 0;
`

const ChargeButtonView = styled.View`
	padding: 0 ${horizontalScale(24)}px ${verticalScale(40)}px;
`

const ChargeButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.turquoise};
	border-radius: ${moderateScale(12)}px;
	padding: ${moderateScale(20)}px;
`

const BookmarkModalContainer = styled.View`
	flex: 1;
	z-index: 1;
	justify-content: center;
	padding: ${moderateScale(22)}px;
`

const BookmarkModalWrap = styled.View`
	background-color: #fff;
	border-radius: ${moderateScale(8)}px;
	padding: ${moderateScale(22)}px;
`

const BookmarkButtonView = styled.View`
	flex-direction: row;
	justify-content: space-between;
`

const BookmarkCancelButton = styled.TouchableOpacity`
	flex: 0.45;
	align-items: center;
	background-color: ${theme.colors.disabled};
	border-width: ${horizontalScale(0)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white};
	padding: ${moderateScale(15)}px;
`

const BookmarkRegButton = styled.TouchableOpacity`
	flex: 0.45;
	align-items: center;
	background-color: ${theme.colors.disabled};
	border-width: ${horizontalScale(0)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white};
	padding: ${moderateScale(15)}px;
`

const ModalContainer = styled.View`
	flex: 1;
	justify-content: space-between;
	z-index: 1;
	flex-direction: column;
	justify-content: flex-end;
`

const Feedback = styled.View`
	height: 80%;
`

const ModalWrap = styled.View`
	border-radius: ${moderateScale(12)}px;
	background-color: ${theme.colors.white};
	padding-bottom: ${verticalScale(20.5)}px;
`

const ModalItemView = styled.Pressable`
	flex-direction: row;
	padding-top: ${verticalScale(24)}px;
	padding-left: ${horizontalScale(20)}px;
	padding-bottom: ${verticalScale(20)}px;
`

const ModalItemImg = styled.Image`
	width: ${moderateScale(20)}px;
	height: ${moderateScale(20)}px;
	margin-right: ${horizontalScale(12)}px;
`

const IconButton = styled.TouchableOpacity``

export default function ChargingStationMap() {
	const { $alert } = useAlert()
	const { navigate, replace } = useNavigation()
	const { getLocation } = useGeolocation()
	// NAVER MAP API
	const mapView = useRef(null)
	const [enableLayerGroup, setEnableLayerGroup] = useState(true)
	const { getConnStatus } = useConnector()
	const [loc, setLoc] = useState({
		latitude: 0,
		longitude: 0,
	})
	// Bookmark Modal State
	const [placeName, setPlaceName] = useState('')
	const [bookmarkModal, setBookmarkModal] = useState(false)
	// FindRoad Modal State
	const [findRoadModal, setFindRoadModal] = useState(false)
	const [disabled, setDisabled] = useState(false)

	// const [bookmark, setBookmark] = useState(false)
	const { state: stationState, dispatch: stationDispatch } = useStationContext()
	const { data: stationDetailData } = stationState.stationDetail
	const stationDetail = stationDetailData?.data

	const { dispatch: bookmarkDispatch } = useUserFavoriteStationContext()

	// user state
	const {
		userState: { id: userId, isLoggined },
	} = useUser()
	// query parameter
	const {
		params: { stationId },
	} = useRoute()
	// radio button value
	const [checked, setChecked] = useState('')
	// waiting count
	const [waitingCnt, setWaitingCnt] = useState(0)
	// charge api request
	const [chargeRequest, setChargeRequest] = useState({
		stationId: 0,
		chargeSpeed: '',
	})

	// initial set radioButton, waitingCnt
	useFocusEffect(
		useCallback(() => {
			setChecked('')
			setWaitingCnt(0)
		}, []),
	)

	// initial set chargeRequest
	useFocusEffect(
		useCallback(() => {
			if (stationId) {
				setChargeRequest({
					...chargeRequest,
					stationId,
				})

				getStationDetail()
			}
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

	// 충전소 상세 API
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

	// 속도별 충전기 웨이팅 조회 API
	async function getStationWaiting(chargeSpeed) {
		try {
			const response = await GET_STATION_WAITING(stationDispatch, {
				stationId,
				chargeSpeed,
			})
			if (response.data?.success) {
				console.log(response.data)
				setWaitingCnt(response.data.data)
			}
		} catch (err) {
			console.log('station waiting error => ', err)
		}
	}

	// 충전버튼 클릭 함수
	async function handlePressCharge() {
		if (validationCheck()) {
			setDisabled(true)
			try {
				const response = await POST_STATION_CHARGE(stationDispatch, chargeRequest)
				const resData = response?.data
				if (resData.success) {
					console.log(response.data)
					if (resData.data === 1) {
						navigate(MAIN_TAB_FLOW, { screen: MAIN_SCREEN })
						getConnStatus(false)
					}
				} else {
					console.log(resData)
					$alert(resData.msg)

					if (resData.code === 'ESVC067') {
						replace(MY_CHABAP_TAB_FLOW, { screen: MY_CHABAP_CHARGE_HISTORY_SCREEN })
					}
				}

				setDisabled(false)
			} catch (err) {
				console.log('station charge error => ', err)
				$alert(err)
				setDisabled(false)
			}
		}
	}

	function validationCheck() {
		if (checked === '') {
			$alert('충전 유형을 선택해주세요.')
			return false
		}

		if (disabled) {
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

	// 충전속도 선택 함수
	function handlePressCheck(totalChgCnt, chargeSpeed) {
		if (totalChgCnt > 0) {
			setChecked(chargeSpeed)
			setChargeRequest({
				...chargeRequest,
				chargeSpeed,
			})
			getStationWaiting(chargeSpeed)
		} else {
			$alert('충전 가능한 충전기가 없습니다.')
		}
	}

	// 즐겨찾기 추가
	async function handlePressBookMark() {
		// if (placeName) {
		try {
			const response = await POST_TOGGLE_BOOK_MARK(bookmarkDispatch, {
				stationId,
				nickName: placeName,
			})
			const resData = response.data
			if (resData.data === true) {
				setBookmarkModal(false)
				getStationDetail()
			} else {
				$alert(resData.data.msg)
			}
			console.log(resData.data)
		} catch (e) {
			console.log('error : ', e)
		}
		// }
	}

	// 길찾기 함수
	async function handlePressNavi(index) {
		if (isLoggined) {
			try {
				const location = await getLocation()
				if (location.code === 200) {
					const { latitude, longitude } = location

					try {
						const response = await GET_FIND_ROAD_REQ_DATA(stationDispatch, {
							stationId: stationDetail.stationId,
						})
						const resData = response.data
						console.log('find road api : ', resData)
						setFindRoadModal(false)
						if (resData?.code === 'SUCCESS' && resData?.data) {
							const arrivalData = resData.data

							if (index === 0) {
								try {
									await nmapOpen({
										slat: latitude,
										slng: longitude,
										sname: '내 위치',
										dlat: arrivalData.latitude,
										dlng: arrivalData.longitude,
										dname: arrivalData.name,
										installed: true,
									})
								} catch (error) {
									console.log('naver map open error => ', error)
									if (error.code === 'EUNSPECIFIED') {
										await nmapOpen({
											slat: latitude,
											slng: longitude,
											sname: '내 위치',
											dlat: arrivalData.latitude,
											dlng: arrivalData.longitude,
											dname: arrivalData.name,
											installed: false,
										})
									}
								}
							} else if (index === 1) {
								try {
									await kakaoMapOpen({
										sp: `${latitude},${longitude}`,
										ep: `${arrivalData.latitude},${arrivalData.longitude}`,
										installed: true,
									})
								} catch (error) {
									console.log('kakao navi open error => ', error)
									if (error.code === 'EUNSPECIFIED') {
										await kakaoMapOpen({
											sp: `${latitude},${longitude}`,
											ep: `${arrivalData.latitude},${arrivalData.longitude}`,
											installed: false,
										})
									}
								}
							} else if (index === 2) {
								try {
									await tMapOpen({
										rGoName: arrivalData.name,
										rGoX: arrivalData.longitude,
										rGoY: arrivalData.latitude,
										installed: true,
									})
								} catch (error) {
									console.log('tmap open error => ', error)
									if (error.code === 'EUNSPECIFIED') {
										await tMapOpen({
											rGoName: arrivalData.name,
											rGoX: arrivalData.longitude,
											rGoY: arrivalData.latitude,
											installed: false,
										})
									}
								}
							}
						} else if (resData?.code !== 'SUCCESS' && resData?.msg) {
							setTimeout(() => {
								$alert(resData.msg)
							}, 0)
						}
					} catch (error) {
						setFindRoadModal(false)
						console.log('find arrival error => ', error)
					}
				}
			} catch (error) {
				setFindRoadModal(false)
				console.log('get location error => ', error)
			}
		} else {
			setFindRoadModal(false)
			// setTimeout(() => {
			// 	signConfirm()
			// }, 0)
		}
	}

	return (
		<>
			<ScrollView showsVerticalScrollIndicator={false}>
				<MapView>
					<NaverMapView
						ref={mapView}
						style={{ width: '100%', height: '100%' }}
						showsMyLocationButton={true}
						center={{ ...loc, zoom: 16 }}
						onTouch={(e) => console.log('onTouch', JSON.stringify(e.nativeEvent))}
						// onCameraChange={(e) => console.log('onCameraChange', JSON.stringify(e))}
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
					<SearchView style={styles.shadow}>
						<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
							<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
								<IconButton
									onPress={() =>
										stationDetail.fvrtFlag === 'Y' ? handlePressBookMark() : setBookmarkModal(true)
									}
								>
									{stationDetail.fvrtFlag === 'Y' ? (
										<Image source={require('@assets/icons/bookmark_filled.png')} />
									) : (
										<Image source={require('@assets/icons/bookmark_blank.png')} />
									)}
								</IconButton>
								<View style={{ margin: moderateScale(5) }} />
								<SmallText style={styles.boldText}>{stationDetail.name}</SmallText>
							</View>
							<View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
								<IconButton onPress={() => setFindRoadModal(true)}>
									{/* <SearchRoadSvg width={moderateScale(40)} height={moderateScale(40)} /> */}
									<Image source={require('@assets/icons/search_road.png')} />
								</IconButton>
							</View>
						</View>
					</SearchView>

					<Contents style={styles.shadow}>
						<RowView>
							<SmallText style={styles.nameText}>주소</SmallText>
							<View>
								{/* 주소1 */}
								<SmallText style={styles.valueText}>{stationDetail.addr1}</SmallText>
								<View style={{ alignItems: 'flex-end' }}>
									{/* 주소2 */}
									<SmallText style={styles.valueText}>{stationDetail.addr2}</SmallText>
								</View>
							</View>
						</RowView>
						<RowView>
							<SmallText style={styles.nameText}>거리</SmallText>
							<SmallText style={styles.valueText}>{`${stationDetail.distance.toFixed(2)} ${
								stationDetail.distanceUnit
							} | ${getTimeToString(stationDetail.hours, stationDetail.minutes)}`}</SmallText>
						</RowView>
						<RowView>
							<SmallText style={styles.nameText}>운영시간</SmallText>
							<SmallText style={styles.valueText}>
								{stationDetail.oprtnStartTime.substring(0, 5)} ~{' '}
								{stationDetail.oprtnEndTime.substring(0, 5)}
							</SmallText>
						</RowView>
						<RowView>
							<SmallText style={styles.nameText}>단가</SmallText>
							<View>
								<SmallText style={styles.valueText}>완속 : {stationDetail.slowChgPrice}원</SmallText>
								<View style={{ margin: moderateScale(3) }} />
								<SmallText style={styles.valueText}>중속 : {stationDetail.mediumChgPrice}원</SmallText>
								<View style={{ margin: moderateScale(3) }} />
								<SmallText style={styles.valueText}>급속 : {stationDetail.quickChgPrice}원</SmallText>
							</View>
						</RowView>
					</Contents>

					<Contents style={styles.shadow}>
						<RowView>
							<SmallText style={styles.boldText}>지원 충전기 타입</SmallText>
						</RowView>
						<RowView style={{ padding: moderateScale(10) }}>
							<ChargerCntView style={styles.shadow}>
								<SmallText style={styles.nameText}>완속{'  '}</SmallText>
								<SmallText style={styles.chargeCntText}>{stationDetail.totalSlowChgCnt}</SmallText>
								<SmallText style={styles.nameText}>개</SmallText>
							</ChargerCntView>
							<ChargerCntView style={styles.shadow}>
								<SmallText style={styles.nameText}>중속{'  '}</SmallText>
								<SmallText style={styles.chargeCntText}>{stationDetail.totalMediumChgCnt}</SmallText>
								<SmallText style={styles.nameText}>개</SmallText>
							</ChargerCntView>
							<ChargerCntView style={styles.shadow}>
								<SmallText style={styles.nameText}>급속{'  '}</SmallText>
								<SmallText style={styles.chargeCntText}>{stationDetail.totalQuickChgCnt}</SmallText>
								<SmallText style={styles.nameText}>개</SmallText>
							</ChargerCntView>
						</RowView>
					</Contents>

					<Contents style={styles.shadow}>
						<RowView>
							<SmallText style={styles.boldText}>충전 유형 선택</SmallText>
						</RowView>

						<RowView>
							<SmallText style={styles.valueText}>충전하실 충전기 방식을 선택해주세요.</SmallText>
						</RowView>

						<RowView>
							<ChargeTypeView style={styles.shadow}>
								<SmallText style={styles.nameText}>완속</SmallText>
								<View style={{ margin: moderateScale(5) }} />
								<SmallText style={styles.valueText}>7 ~ 11 kW</SmallText>
								<View style={{ margin: moderateScale(5) }} />

								<Checkbox
									onPress={() => {
										handlePressCheck(stationDetail.totalSlowChgCnt, 'SLOW')
									}}
									checked={checked === 'SLOW' ? true : false}
									checkStyle={styles.checkBox}
									uncheckStyle={styles.checkBox}
									customTrueImage={
										<CheckBoxImage
											source={require('@assets/icons/check.png')}
											tintColor={theme.colors.turquoise}
										/>
									}
									customFalseImage={
										<CheckBoxImage
											source={require('@assets/icons/check.png')}
											tintColor={theme.colors.disabled}
										/>
									}
								/>
							</ChargeTypeView>

							<ChargeTypeView style={styles.shadow}>
								<SmallText style={styles.nameText}>중속</SmallText>
								<View style={{ margin: moderateScale(5) }} />
								<SmallText style={styles.valueText}>22 ~ 30 kW</SmallText>
								<View style={{ margin: moderateScale(5) }} />

								<Checkbox
									onPress={() => {
										handlePressCheck(stationDetail.totalMediumChgCnt, 'MEDIUM')
									}}
									checked={checked === 'MEDIUM' ? true : false}
									checkStyle={styles.checkBox}
									uncheckStyle={styles.checkBox}
									customTrueImage={
										<CheckBoxImage
											source={require('@assets/icons/check.png')}
											tintColor={theme.colors.turquoise}
										/>
									}
									customFalseImage={
										<CheckBoxImage
											source={require('@assets/icons/check.png')}
											tintColor={theme.colors.disabled}
										/>
									}
								/>
							</ChargeTypeView>

							<ChargeTypeView style={styles.shadow}>
								<SmallText style={styles.nameText}>급속</SmallText>
								<View style={{ margin: moderateScale(5) }} />
								<SmallText style={styles.valueText}>03 kW ~</SmallText>
								<View style={{ margin: moderateScale(5) }} />

								<Checkbox
									onPress={() => {
										handlePressCheck(stationDetail.totalQuickChgCnt, 'QUICK')
									}}
									checked={checked === 'QUICK' ? true : false}
									checkStyle={styles.checkBox}
									uncheckStyle={styles.checkBox}
									customTrueImage={
										<CheckBoxImage
											source={require('@assets/icons/check.png')}
											tintColor={theme.colors.white}
										/>
									}
									customFalseImage={
										<CheckBoxImage
											source={require('@assets/icons/check.png')}
											tintColor={theme.colors.disabled}
										/>
									}
								/>
							</ChargeTypeView>
						</RowView>
					</Contents>

					<Contents style={styles.shadow}>
						<RowView>
							<SmallText style={{ fontSize: moderateScale(16) }}>차밥 이용 유의사항</SmallText>
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
				</Container>
			</ScrollView>

			{/* 버튼 영역 */}
			<ChargeButtonView>
				<ChargeButton
					style={{
						backgroundColor:
							stationDetail.status === CHARGEABLE && !disabled
								? theme.colors.turquoise
								: theme.colors.disabled,
					}}
					onPress={() => {
						if (stationDetail.status === CHARGEABLE) handlePressCharge()
						else $alert('충전이 불가능한 지역입니다.')
					}}
				>
					{waitingCnt === 0 ? (
						<SmallText style={styles.buttonText}>바로 충전하기</SmallText>
					) : waitingCnt > 0 ? (
						<SmallText style={{ fontWeight: 'bold', color: 'white' }}>
							{waitingCnt}번째 대기열 등록
						</SmallText>
					) : null}
				</ChargeButton>
			</ChargeButtonView>

			{/* 북마크 모달 */}
			{bookmarkModal && (
				<Modal.Common
					transparent={true}
					visible={bookmarkModal}
					animationType="fade"
					setClose={() => setBookmarkModal(false)}
				>
					<BookmarkModalContainer>
						<BookmarkModalWrap>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ marginRight: horizontalScale(8) }}>
									<Image source={require('@assets/icons/thunder.png')} />
								</View>
								<View style={{ paddingTop: verticalScale(8) }}>
									<SmallText style={styles.boldText}>{stationDetail.name}</SmallText>
									<View style={{ margin: moderateScale(5) }} />
									<SmallText style={styles.valueText}>{stationDetail.addr1}</SmallText>
									<SmallText style={styles.valueText}>{stationDetail.addr2}</SmallText>
								</View>
							</View>

							<View style={{ margin: moderateScale(15) }} />

							<TextInput
								type={'text'}
								placeholder="주소 명칭을 입력하세요."
								value={placeName}
								maxLength={10}
								isShadow={false}
								style={styles.textInput}
								onChangeText={(text) => setPlaceName(text)}
								setRemoveText={() => setPlaceName('')}
								returnKeyType="done"
								onSubmitEditing={() => {}}
							/>

							<View style={{ margin: moderateScale(10) }} />

							<BookmarkButtonView>
								<BookmarkCancelButton onPress={() => setBookmarkModal(false)}>
									<SmallText style={styles.nameText}>취소</SmallText>
								</BookmarkCancelButton>

								<BookmarkRegButton
									style={{
										backgroundColor: placeName ? theme.colors.turquoise : theme.colors.disabled,
									}}
									onPress={() => handlePressBookMark()}
								>
									<SmallText style={placeName ? styles.bookmarkBtnText : styles.nameText}>
										등록하기
									</SmallText>
								</BookmarkRegButton>
							</BookmarkButtonView>
						</BookmarkModalWrap>
					</BookmarkModalContainer>
				</Modal.Common>
			)}

			{/* 길찾기 모달 */}
			{findRoadModal === true && (
				<Modal.Common
					transparent={true}
					visible={findRoadModal}
					animationType="fade"
					setClose={() => setFindRoadModal(false)}
				>
					<Feedback />
					<ModalContainer>
						<ModalWrap>
							<ModalItemView onPress={() => handlePressNavi(0)}>
								<ModalItemImg source={require('@assets/icons/nmap-mdpi.png')} />
								<SmallText>네이버 지도</SmallText>
							</ModalItemView>
							<ModalItemView onPress={() => handlePressNavi(1)}>
								<ModalItemImg source={require('@assets/icons/kakaomap-mdpi.png')} />
								<SmallText>카카오 네비</SmallText>
							</ModalItemView>
							<ModalItemView onPress={() => handlePressNavi(2)}>
								<ModalItemImg source={require('@assets/icons/tmap-mdpi.png')} />
								<SmallText>T map</SmallText>
							</ModalItemView>
						</ModalWrap>
					</ModalContainer>
				</Modal.Common>
			)}
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
	textInput: {
		borderRadius: moderateScale(5),
		borderWidth: moderateScale(1),
		borderColor: theme.colors.disabled,
	},
	boldText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
	},
	buttonText: {
		fontSize: moderateScale(16),
		fontWeight: 'bold',
		color: '#fff',
	},
	nameText: {
		fontWeight: '600',
		color: '#191919',
	},
	valueText: {
		fontWeight: '600',
		color: '#797979',
	},
	bookmarkBtnText: {
		fontWeight: 'bold',
		color: '#fff',
	},
	chargeCntText: {
		fontWeight: 'bold',
		color: theme.colors.turquoise,
	},
	checkBox: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		borderRadius: moderateScale(99),
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(1),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(0.5),
		elevation: 3,
		padding: moderateScale(5),
	},
})
