import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import { StyleSheet } from 'react-native'
import { theme } from '@/theme'
import SmallText from '@/components/ui/text/SmallText'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import Row from '@/components/ui/view/Row'
import { useUser } from '@/core/store/common/providers/UserProvider'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import { useFocusEffect } from '@react-navigation/core'
import { GET_CHARGING_DATA } from '@/core/store/api/create/chargeQueueCreate'
import { initialChargingData, useChargeQueueContext } from '@/core/store/api/providers/ChargeQueueApiProvider'
import { useError } from '@/core/store/common/providers/ErrorProvider'
import CarSelectionModal from '../modal/CarSelectionModal'

const Contents = styled.View`
	padding-top: ${verticalScale(16)}px;
	padding-left: ${horizontalScale(16)}px;
`

const ItemView = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-right: ${horizontalScale(17)}px;
`

// const Footer = styled.View`
// 	align-items: center;
// 	padding-bottom: ${verticalScale(16)}px;
// `

// const Label = styled.View`
// width: 100%;
// 	background-color: ${theme.colors.background};
// 	border-width: 1px;
// 	border-color: ${theme.colors.background};
// 	border-radius: ${moderateScale(5)}px;
// 	justify-content: center;
// 	align-items: center;
// `

// const ImageView = styled.View`
// 	padding-left: ${horizontalScale(8)}px;
// 	justify-content: center;
// `

export default function MainMyChabapCharging({ appStateVisible, carSelectModalData }) {
	const {
		userState: { isLoggined, defaultUserEvId },
	} = useUser()

	const { state: cqState, dispatch: cqDispatch } = useChargeQueueContext()
	const { data: cqChargingData } = cqState.chargingData
	const chargingData = cqChargingData?.data || initialChargingData.data
	const timerId = useRef(null)
	const time = useRef(0)
	const [countTime, setCountTime] = useState({ hour: 0, min: 0, sec: 0 })
	const { $error } = useError()

	useFocusEffect(
		useCallback(() => {
			clearInterval(timerId.current)
			getChargingData()
		}, [isLoggined, defaultUserEvId]),
	)

	useEffect(() => {
		return () => {
			clearInterval(timerId.current)
		}
	}, [])

	useEffect(() => {
		console.log('app status change => ', appStateVisible)
		if (appStateVisible === 'background' || appStateVisible === 'inactive') {
			clearInterval(timerId.current)
		} else if (appStateVisible === 'active') {
			clearInterval(timerId.current)
			getChargingData()
		}
	}, [appStateVisible])

	async function getChargingData() {
		if (isLoggined) {
			try {
				const response = await GET_CHARGING_DATA(cqDispatch)
				const resData = response.data
				if (resData.code === 'SUCCESS') {
					const data = resData?.data

					if (data.chargeTime > -1) {
						time.current = data.chargeTime
						if (timerId.current) clearInterval(timerId.current)
						countUp()
					}
				}
			} catch (err) {
				console.log('charging data err => ', err)
				const errData = err?.data
				if (errData?.code) {
					const { code, msg } = errData
					setTimeout(() => {
						$error({
							code,
							msg,
							onPress: (result) => {
								if (result) {
									getChargingData()
								}
							},
						})
					}, 1000)
				}
			}
		}
	}

	// 매초마다 시간 증가 함수
	function countUp() {
		timerId.current = setInterval(() => {
			time.current += 1
			setCountTime({
				hour: parseInt(time.current / 3600, 10),
				min: parseInt((time.current / 60) % 60, 10),
				sec: parseInt(time.current % 60, 10),
			})

			if (time.current % 60 === 0) {
				// 60초마다 실행 api call
				getChargingData()
			}
		}, 1000)
	}

	return (
		<>
			<CarSelectionModal carSelectModalData={carSelectModalData} />
			<Contents>
				<Row style={{ paddingTop: verticalScale(16) }}>
					<SmallText style={{ ...styles.turquoiseTextColor, ...styles.medium }}>
						{chargingData.stationName}
					</SmallText>
					<SmallText style={styles.medium}>{'에서 '}</SmallText>
					<SmallText style={styles.medium}>{'Cha Bap 먹는 중...'}</SmallText>
				</Row>
				<ItemView style={{ paddingTop: verticalScale(21), paddingBottom: verticalScale(13) }}>
					<Left>
						<SmallText style={styles.font12}>{'충전 시간'}</SmallText>
					</Left>
					<Right>
						<SmallText style={styles.bold}>{`${
							countTime.hour < 10 ? '0' + countTime.hour : countTime.hour
						} : ${countTime.min < 10 ? '0' + countTime.min : countTime.min} : ${
							countTime.sec < 10 ? '0' + countTime.sec : countTime.sec
						}`}</SmallText>
					</Right>
				</ItemView>
				<ItemView style={{ paddingBottom: verticalScale(13) }}>
					<Left>
						<SmallText style={styles.font12}>{'충전량'}</SmallText>
					</Left>
					<Right>
						<SmallText style={styles.bold}>{`${chargingData.kw ? chargingData.kw : 0} kW`}</SmallText>
					</Right>
				</ItemView>
				<ItemView style={{ paddingBottom: verticalScale(19) }}>
					<Left>
						<SmallText style={styles.font12}>{'충전 금액'}</SmallText>
					</Left>
					<Right>
						<SmallText style={styles.bold}>{`${
							chargingData.amount ? chargingData.amount : 0
						} 원`}</SmallText>
					</Right>
				</ItemView>
			</Contents>
			{/* <Footer>
				<Label>
					<Row>
						<ImageView>
							<ExclamationRedSvg
								width={moderateScale(32)}
								height={moderateScale(32)}
							/>
						</ImageView>
						<View style={{ flexDirection: 'column', padding: moderateScale(8) }}>
							<SmallText style={styles.dangerTextColor}>
								충전소 이용 시작가능 시간을 꼭 지켜주세요!
							</SmallText>
							<SmallText style={styles.dangerTextColor}>
								시작시간 이후에는 다음 대기열로 넘어갑니다.
							</SmallText>
						</View>
					</Row>
				</Label>
			</Footer> */}
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
	fontWhite: {
		color: theme.colors.white,
	},
	modelText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		color: theme.colors.darkGray,
	},
	turquoiseTextColor: {
		color: theme.colors.turquoise,
	},
	dangerTextColor: {
		color: theme.colors.error,
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
})
