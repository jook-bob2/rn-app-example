import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/native'
import MainMyChabap from './myChabap/MainMyChabap'
import MainRecentCharge from './recentCharge/MainRecentCharge'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { theme } from '@/theme'
import { moderateScale, verticalScale } from '@/theme/scaling'
import { useUser } from '@/core/store/common/providers/UserProvider'
import MainNearbyChargingStation from './nearbyChargingStation/MainNearbyChargingStation'
import MainUserSelect from './userSelect/MainUserSelect'
import Loading from '../ui/Loading'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import MainEvent from './event/MainEvent'
import MainChargeMethod from './chargeMethod/MainChargeMethod'
import MainElecTip from './elecTip/MainElecTip'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import constants from '@/navigations/constants'
import shareConst from '@/constants/shareConst'
import { useUserEvContext } from '@/core/store/api/providers/UserEvApiProvider'
import { GET_RECEIVED_SHARE_LIST, GET_USER_EV_LIST } from '@/core/store/api/create/userEvCreate'
import useGeolocation from '@/hooks/useGeolocation'
import { GET_STATION_LIST } from '@/core/store/api/create/stationCreate'
import { useStationContext } from '@/core/store/api/providers/StationApiProvider'
import { useChargeQueueContext } from '@/core/store/api/providers/ChargeQueueApiProvider'
// import { PATCH_CHANGE_DEFAULT_USER_EV } from '@/core/store/api/create/userCreate'
import { ArrowNextSvg } from '@/utils/svgUtil'
import { useConnector } from '@/core/store/common/providers/ConnectorStatusProvider'
import { useError } from '@/core/store/common/providers/ErrorProvider'
import { GET_IS_UNPAID } from '@/core/store/api/create/paymentCreate'
import { usePaymentContext } from '@/core/store/api/providers/PaymentApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import Subtitle from '../ui/text/Subtitle'
import Row from '../ui/view/Row'
import SmallText from '../ui/text/SmallText'

const Container = styled.ScrollView`
	flex: 1;
	padding-left: 16px;
	padding-right: 16px;
	padding-bottom: 16px;
	background-color: ${theme.colors.background};
`

const Contents = styled.View`
	padding-top: 24px;
	padding-bottom: 36px;
`

const UnpaidContainer = styled.View`
	align-items: center;
	justify-content: center;
`

const UnpaidTitleView = styled.View`
	/* padding-bottom: ${verticalScale(10)}px; */
`

const { MY_CHABAP_TAB_FLOW, MY_CHABAP_FAMILY_TERMS_SCREEN } = constants
const { SHARE_TYPE_SHARED } = shareConst

function NextImg() {
	return <ArrowNextSvg width={moderateScale(6)} height={moderateScale(10)} />
}

export default function Main() {
	const { setOptions, navigate } = useNavigation()
	const { $confirm } = useConfirm()
	const {
		userState: { isLoggined, name, id },
	} = useUser()
	const [carValue, setCarValue] = useState({
		value: '',
		userEvId: 0,
	})
	const [status, setStatus] = useState(null)
	const { $alert } = useAlert()
	const { $error } = useError()
	// const timerId = useRef(null)
	const { getLocation } = useGeolocation()
	const { state: userState } = useUserContext()
	const { dispatch: userEvDispatch } = useUserEvContext()
	const { connectorState, loading: connLoading } = useConnector()
	const { dispatch: stationDispatch } = useStationContext()
	const { state: chargeQueueState } = useChargeQueueContext()
	const { dispatch: paymentDispatch } = usePaymentContext()
	const { loading: userSelectLoading } = userState.userSignSelect
	const { loading: changeDefaultUserEvLoading } = userState.changeDefaultUserEv
	const { loading: chargeQueueSaveLoading } = chargeQueueState.chargeQueueSave
	const { loading: sendSteveLoading } = chargeQueueState.sendSteve

	useFocusEffect(
		useCallback(() => {
			shareConfirm()
		}, [isLoggined, id]),
	)

	useFocusEffect(
		useCallback(() => {
			setTitle()
		}, [isLoggined, name]),
	)

	useEffect(() => {
		setStatus(connectorState.status)
	}, [connectorState])

	useEffect(() => {
		getIsUnpaid()
	}, [isLoggined])

	// 공유하기/공유받기 요청 confirm
	async function shareConfirm() {
		if (isLoggined) {
			try {
				const response = await GET_RECEIVED_SHARE_LIST(userEvDispatch, { userId: id })
				if (response.data.success && response.data.data.length > 0) {
					const shareQueue = response.data.data[0]

					setTimeout(() => {
						$confirm({
							msg:
								shareQueue.fromUserName +
								' 님으로 부터 차밥식구로 공유되었습니다.\n\n공유 받으시겠습니까?',
							cancelButtonName: '닫기',
							confirmButtonName: '공유받기',
							onPress: (result) => {
								if (result)
									navigate(MY_CHABAP_TAB_FLOW, {
										screen: MY_CHABAP_FAMILY_TERMS_SCREEN,
										params: {
											shareType: SHARE_TYPE_SHARED,
											shareQueueId: shareQueue.shareQueueId,
											userEvId: shareQueue.userEvId,
											model: shareQueue.model,
										},
									})
							},
						})
					}, 1000)
				}
			} catch (error) {
				console.log('share error => ', error)
				const errData = error?.data
				if (errData?.code) {
					const { code, msg } = errData
					setTimeout(() => {
						$error({
							code,
							msg,
							onPress: (result) => {
								if (result) {
									shareConfirm()
								}
							},
						})
					}, 1000)
				}
			}
		}
	}

	function setTitle() {
		if (isLoggined) {
			setOptions({
				title: `${name} 님`,
			})
		} else {
			setOptions({
				title: `로그인 해주세요.`,
			})
		}
	}

	async function getStationList() {
		try {
			const loc = await getLocation()
			if (loc.code === 200) {
				const { latitude, longitude } = loc
				try {
					await GET_STATION_LIST(stationDispatch, {
						userId: id,
						latitude,
						longitude,
						distance: 30,
					})
				} catch (err2) {
					console.log('near station error => ', err2)
				}
			}
		} catch (err) {
			console.log('get location error => ', err)
			const errData = err?.data
			if (errData?.code) {
				const { code, msg } = errData
				setTimeout(() => {
					$error({
						code,
						msg,
						onPress: (result) => {
							if (result) {
								getStationList()
							}
						},
					})
				}, 1000)
			}
		}
	}

	async function getUserEvList() {
		if (isLoggined) {
			try {
				const response = await GET_USER_EV_LIST(userEvDispatch)
				const resData = response.data
				if (resData?.code === 'SUCCESS' && resData?.data) {
					return resData.data
				}
			} catch (e) {
				console.log('get user ev list error => ', e)
				const errData = e?.data
				if (errData?.code) {
					const { code, msg } = errData
					setTimeout(() => {
						$error({
							code,
							msg,
							onPress: (result) => {
								if (result) {
									getUserEvList()
								}
							},
						})
					}, 1000)
				}
			}
		}
	}

	async function getIsUnpaid() {
		if (isLoggined) {
			try {
				const response = await GET_IS_UNPAID(paymentDispatch)
				const resData = response.data
				if (resData?.code === 'SUCCESS' && resData?.data === true) {
					setTimeout(() => {
						$alert({
							msg: () => {
								return (
									<UnpaidContainer>
										<UnpaidTitleView>
											<Subtitle
												style={{
													color: theme.colors.text,
													fontFamily: theme.fonts.spoqaHanSansNeo.bold,
												}}
											>
												미납 요금이 존재합니다.
											</Subtitle>
											<Row
												style={{
													alignItems: 'center',
													justifyContent: 'center',
													marginTop: 10,
												}}
											>
												<SmallText>이용내역에서 확인바랍니다.</SmallText>
											</Row>
										</UnpaidTitleView>
									</UnpaidContainer>
								)
							},
						})
					}, 1000)
				}
			} catch (e) {
				console.log('select isUnpaid error => ', e)
			}
		}
	}

	// function refreshConnect() {
	// 	if (isLoggined) {
	// 		timerId.current = setInterval(async () => {
	// 			// 1분마다 연결 상태 체크
	// 			console.log('isFocused => ', isFocused())
	// 			if (isFocused()) {
	// 				console.log('연결 상태 체크')
	// 				getConnStatus()
	// 			} else {
	// 				console.log('remove interval')
	// 				clearInterval(timerId.current)
	// 			}
	// 		}, 1000 * 60)
	// 	}
	// }

	return (
		<>
			{(userSelectLoading ||
				connLoading ||
				changeDefaultUserEvLoading ||
				chargeQueueSaveLoading ||
				sendSteveLoading) && <Loading />}

			<Container showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
				<MainMyChabap
					status={status}
					carValue={carValue}
					setCarValue={setCarValue}
					getUserEvList={getUserEvList}
				/>
				{status === 0 ? (
					<Contents>
						{/* 가장 가까운 충전소 */}
						<MainNearbyChargingStation NextImg={NextImg} getStationList={getStationList} />
						{/* 이벤트&소식 */}
						<MainEvent NextImg={NextImg} />
					</Contents>
				) : status === 1 ? (
					<Contents>
						{/* 가장 가까운 충전소 */}
						<MainNearbyChargingStation NextImg={NextImg} getStationList={getStationList} />
						{/* 최근 충전 내역 */}
						<MainRecentCharge NextImg={NextImg} />
					</Contents>
				) : status === 2 ? (
					<Contents>
						{/* 충전 방법 */}
						<MainChargeMethod />
						{/* 이벤트&소식 */}
						<MainEvent NextImg={NextImg} />
					</Contents>
				) : status === 3 ? (
					<Contents>
						{/* 충전 방법 */}
						<MainChargeMethod />
						{/* 이벤트&소식 */}
						<MainEvent NextImg={NextImg} />
					</Contents>
				) : status === 4 ? (
					<Contents>
						{/* 차밥 전기차 Tip */}
						<MainElecTip />
						{/* 이벤트&소식 */}
						<MainEvent NextImg={NextImg} />
					</Contents>
				) : null}
				<MainUserSelect getUserEvList={getUserEvList} />
			</Container>
		</>
	)
}
