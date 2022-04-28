import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import { StyleSheet, View } from 'react-native'
import { theme } from '@/theme'
import SmallText from '@/components/ui/text/SmallText'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import Row from '@/components/ui/view/Row'
import { useUser } from '@/core/store/common/providers/UserProvider'
import { useFocusEffect } from '@react-navigation/core'
import {
	GET_CHARGE_QUEUE_RETURN,
	PATCH_SEND_STEVE,
	POST_CHARGE_QUEUE_SAVE,
} from '@/core/store/api/create/chargeQueueCreate'
import { useChargeQueueContext } from '@/core/store/api/providers/ChargeQueueApiProvider'
import { StatusCd } from '@/constants/chargeQueueConst'
import { ExclamationRedSvg } from '@util/svgUtil'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import Button from '@/components/ui/button/Button'
import { useConnector } from '@/core/store/common/providers/ConnectorStatusProvider'

import { useError } from '@/core/store/common/providers/ErrorProvider'
import { GET_STATUS_AVAILABLE } from '@/core/store/api/create/connectorCreate'
import { useConnectorContext } from '@/core/store/api/providers/ConnectorApiProvider'
import CarSelectionModal from '../modal/CarSelectionModal'
import { useAlert } from '@/core/store/common/providers/AlertProvider'

const Contents = styled.View`
	padding-top: ${verticalScale(16)}px;
	padding-left: ${horizontalScale(16)}px;
`

const ItemView = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-right: ${horizontalScale(16)}px;
`

const Footer = styled.View`
	align-items: center;
	/* padding-bottom: ${verticalScale(8)}px; */
	padding-left: ${horizontalScale(16)}px;
	padding-right: ${horizontalScale(16)}px;
`

const Label = styled.View`
	width: 100%;
	background-color: ${theme.colors.background};
	border-width: ${moderateScale(1)}px;
	border-color: ${theme.colors.background};
	border-radius: ${moderateScale(5)}px;
	justify-content: center;
	align-items: flex-start;
`

const ImageView = styled.View`
	padding-left: ${horizontalScale(8)}px;
	justify-content: center;
`

export default function MainMyChabapStandbyComingSoon({
	appStateVisible,
	carSelectModalData,
	isAvailable,
	setIsAvailable,
}) {
	const {
		userState: { id: userId, isLoggined, defaultUserEvId },
	} = useUser()
	const { state: chargeQueueState, dispatch: chargeQueueDispatch } = useChargeQueueContext()
	const { data: chargeQueueData } = chargeQueueState.returnData
	const returnData = chargeQueueData?.data
	const { getConnStatus } = useConnector()
	const timerId = useRef(null)
	const time = useRef(60 * 15)
	const [countTime, setCountTime] = useState({ min: 0, sec: 0 })
	const { $error } = useError()
	const { dispatch: connDispatch } = useConnectorContext()
	const { $alert } = useAlert()

	useFocusEffect(
		useCallback(() => {
			clearInterval(timerId.current)
			getChargeQueueReturn()
		}, [userId, defaultUserEvId]),
	)

	useEffect(() => {
		return () => {
			clearInterval(timerId.current)
		}
	}, [])

	useEffect(() => {
		if (appStateVisible === 'background' || appStateVisible === 'inactive') {
			clearInterval(timerId.current)
		} else if (appStateVisible === 'active') {
			clearInterval(timerId.current)
			getChargeQueueReturn()
		}
	}, [appStateVisible])

	useFocusEffect(
		useCallback(() => {
			getStatusAvailable()
		}, [isLoggined, defaultUserEvId]),
	)

	async function getChargeQueueReturn() {
		if (userId) {
			try {
				const response = await GET_CHARGE_QUEUE_RETURN(chargeQueueDispatch, { userId })
				const resData = response.data
				if (resData.code === 'SUCCESS') {
					const data = resData?.data

					if (data.remainSeconds) {
						time.current = data.remainSeconds
						if (timerId.current) clearInterval(timerId.current)
						countDown(data.chargeQueueId)
					}
				}
			} catch (error) {
				console.log('charge queue return error => ', error)
				const errData = error?.data
				if (errData?.code) {
					const { code, msg } = errData
					setTimeout(() => {
						$error({
							code,
							msg,
							onPress: (result) => {
								if (result) {
									getChargeQueueReturn()
								}
							},
						})
					}, 1000)
				}
			}
		}
	}

	//시간 제한로직
	function countDown(chargeQueueId) {
		timerId.current = setInterval(() => {
			time.current -= 1
			setCountTime({ min: parseInt(time.current / 60, 10), sec: parseInt(time.current % 60, 10) })
			if (time.current === 0) {
				clearInterval(timerId.current)
				reservationCanceled(chargeQueueId)
			}

			if (time.current % 60 === 0 && !isAvailable) {
				getStatusAvailable()
			}
		}, 1000)
	}

	async function handlePressTransactionStart() {
		try {
			const response = await PATCH_SEND_STEVE(chargeQueueDispatch, { status: StatusCd.CHARGING })
			const resData = response.data
			if (resData?.code === 'SUCCESS' && resData?.data) {
				getConnStatus(true)
			} else if (resData?.code === 'ESVC048') {
				$alert('충전기의 연결을 재확인해주세요.')
			}
		} catch (error) {
			console.log('charge queue error => ', error)
			const errData = error?.data
			if (errData?.code) {
				const { code, msg } = errData
				setTimeout(() => {
					$error({
						code,
						msg,
						onPress: (result) => {
							if (result) {
								handlePressTransactionStart()
							}
						},
					})
				}, 1000)
			}
		}
	}

	async function getStatusAvailable() {
		if (isLoggined) {
			try {
				const response = await GET_STATUS_AVAILABLE(connDispatch)
				const resData = response.data
				if (resData?.code === 'SUCCESS' && resData?.data === true) {
					setIsAvailable(resData?.data)
				} else {
					console.log('status available exception => ', resData.code, resData.msg)
				}
			} catch (error) {
				console.log('status available error => ', error)
				const errData = error?.data
				if (errData?.code) {
					const { code, msg } = errData
					setTimeout(() => {
						$error({
							code,
							msg,
							onPress: (result) => {
								if (result) {
									getStatusAvailable()
								}
							},
						})
					}, 1000)
				}
			}
		}
	}

	async function reservationCanceled(chargeQueueId) {
		try {
			const response = await POST_CHARGE_QUEUE_SAVE(chargeQueueDispatch, {
				id: chargeQueueId,
				status: StatusCd.CANCELED,
			})
			const resData = response.data
			if (resData?.code === 'SUCCESS' && resData?.data) {
				await getConnStatus(true)
			}
		} catch (error) {
			console.log('charge queue error => ', error)
		}
	}

	return (
		<>
			<CarSelectionModal carSelectModalData={carSelectModalData} />
			<Contents>
				<Row>
					<SmallText style={{ ...styles.turquoiseTextColor, ...styles.medium }}>{'Cha Bap '}</SmallText>
					<SmallText style={{ ...styles.medium, fontSize: moderateScale(16) }}>
						{'을 서둘러 주세요.'}
					</SmallText>
				</Row>
				<ItemView style={{ paddingTop: verticalScale(24), paddingBottom: verticalScale(16) }}>
					<Left>
						<SmallText style={styles.font12}>{'충전 가능 충전기'}</SmallText>
					</Left>
					<Right>
						<SmallText style={styles.bold}>{returnData?.stationName}</SmallText>
					</Right>
				</ItemView>
				<ItemView style={{ paddingBottom: verticalScale(8) }}>
					<Left>
						<SmallText style={styles.font12}>{'이용 시작 가능시간 '}</SmallText>
					</Left>
					<Right>
						<SmallText style={styles.bold}>{`${
							countTime.min < 10 ? '0' + countTime.min : countTime.min
						} : ${countTime.sec < 10 ? '0' + countTime.sec : countTime.sec}`}</SmallText>
					</Right>
				</ItemView>
			</Contents>
			<Footer>
				<Label>
					<Row>
						<ImageView>
							<ExclamationRedSvg width={moderateScale(32)} height={moderateScale(32)} />
						</ImageView>
						<View style={{ flexDirection: 'column', padding: moderateScale(8) }}>
							<SmallText style={styles.dangerTextColor}>
								충전소 이용 시작 가능 시간을 꼭 지켜주세요! 시작
							</SmallText>
							<SmallText style={styles.dangerTextColor}>
								시간 이후에는 다음 대기열로 넘어갑니다.
							</SmallText>
						</View>
					</Row>
				</Label>
			</Footer>
			{isAvailable && (
				<Row style={{ paddingTop: verticalScale(8) }}>
					<Button style={styles.button} onPress={() => handlePressTransactionStart()}>
						<SmallText style={{ color: theme.colors.white, fontSize: moderateScale(16) }}>
							충전 시작하기
						</SmallText>
					</Button>
				</Row>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.white,
		borderWidth: horizontalScale(1),
		borderRadius: moderateScale(9),
		borderColor: theme.colors.background,
	},
	modelText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		color: theme.colors.darkGray,
	},
	turquoiseTextColor: {
		color: theme.colors.turquoise,
	},
	dangerTextColor: {
		color: theme.colors.danger,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		fontSize: moderateScale(12),
	},
	medium: {
		fontFamily: theme.fonts.spoqaHanSansNeo.medium,
	},
	font12: {
		fontSize: moderateScale(12),
	},
	font14: {
		fontSize: moderateScale(14),
	},
	bold: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	button: {
		width: '100%',
		height: 48,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		borderBottomLeftRadius: moderateScale(8),
		borderBottomRightRadius: moderateScale(8),
	},
})
