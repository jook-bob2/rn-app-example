import React, { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components/native'
import { StyleSheet, View } from 'react-native'
import { theme } from '@/theme'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import Row from '@/components/ui/view/Row'
import SmallText from '@/components/ui/text/SmallText'
import { useUser } from '@/core/store/common/providers/UserProvider'
import { useFocusEffect } from '@react-navigation/core'
import { GET_CHARGE_QUEUE_REGISTRATION } from '@/core/store/api/create/chargeQueueCreate'
import { initialRegistrationData, useChargeQueueContext } from '@/core/store/api/providers/ChargeQueueApiProvider'
import { ExclamationRedSvg } from '@/utils/svgUtil'
import { useError } from '@/core/store/common/providers/ErrorProvider'
import CarSelectionModal from '../modal/CarSelectionModal'

// const Contents = styled.View`
// 	padding-top: ${verticalScale(16)}px;
// 	padding-left: ${horizontalScale(16)}px;
// `

// const UserView = styled.View`
// 	border-color: ${theme.colors.background};
// 	border-radius: ${moderateScale(9)}px;
// 	padding-top: ${moderateScale(5)}px;
// `

const Footer = styled.View`
	align-items: center;
	padding-top: ${verticalScale(24)}px;
	padding-bottom: ${verticalScale(16)}px;
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

export default function MainMyChabapStandbyRegistration({ parents, appStateVisible, carSelectModalData }) {
	const { Contents } = parents
	const {
		userState: { isLoggined, defaultUserEvId },
	} = useUser()
	const { state: chargeQueueState, dispatch: chargeQueueDispatch } = useChargeQueueContext()
	const { data: chargeQueueData } = chargeQueueState.chargeQueueRegistration
	const cqData = chargeQueueData?.data || initialRegistrationData.data
	const { $error } = useError()
	const timerId = useRef(null)

	useFocusEffect(
		useCallback(() => {
			clearInterval(timerId.current)
			getRegistrationData()
		}, [isLoggined, defaultUserEvId]),
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
			getRegistrationData()
		}
	}, [appStateVisible])

	async function getRegistrationData() {
		if (isLoggined) {
			try {
				const response = await GET_CHARGE_QUEUE_REGISTRATION(chargeQueueDispatch)
				const resData = response.data
				if (resData?.code === 'SUCCESS' && resData?.data) {
					if (timerId.current) clearInterval(timerId.current)
					refresh()
				}
			} catch (err) {
				console.log('registration error => ', err)
				const errData = err?.data
				if (errData?.code) {
					const { code, msg } = errData
					setTimeout(() => {
						$error({
							code,
							msg,
							onPress: (result) => {
								if (result) {
									getRegistrationData()
								}
							},
						})
					}, 1000)
				}
			}
		}
	}

	// 매초마다 시간 증가 함수
	function refresh() {
		timerId.current = setInterval(() => {
			getRegistrationData()
		}, 1000 * 60)
	}

	return (
		<>
			<CarSelectionModal carSelectModalData={carSelectModalData} />
			<Contents style={{ paddingHorizontal: horizontalScale(16) }}>
				<Row style={{ paddingTop: verticalScale(16) }}>
					<SmallText style={{ ...styles.turquoiseTextColor, ...styles.medium }}>
						{cqData.stationName}
					</SmallText>
					<SmallText style={{ ...styles.medium }}>{' 충전소를 기다리는 중...'}</SmallText>
				</Row>
				<Row style={{ paddingTop: verticalScale(24) }}>
					<SmallText style={styles.font14}>{'현재 대기순위는 '}</SmallText>
					<SmallText style={{ ...styles.turquoiseTextColor, ...styles.font14 }}>
						{cqData.waitingCnt}
					</SmallText>
					<SmallText style={{ ...styles.font14 }}>{'번째이며,'}</SmallText>
				</Row>
				<Row>
					<SmallText style={{ ...styles.font14 }}>{'총 대기인원 '}</SmallText>
					<SmallText style={{ ...styles.turquoiseTextColor, ...styles.font14 }}>{cqData.peopleCnt}</SmallText>
					<SmallText style={{ ...styles.font14 }}>{'명 입니다.'}</SmallText>
				</Row>
			</Contents>
			<Footer>
				<Label>
					<Row>
						<ImageView>
							<ExclamationRedSvg width={moderateScale(32)} height={moderateScale(32)} />
						</ImageView>
						<View style={{ flexDirection: 'column', padding: moderateScale(8) }}>
							<SmallText style={styles.dangerTextColor}>
								충전소 이용 시작가능 시간을 꼭 지켜주세요! 시작
							</SmallText>
							<SmallText style={styles.dangerTextColor}>
								시간 이후에는 다음 대기열로 넘어갑니다.
							</SmallText>
						</View>
					</Row>
				</Label>
			</Footer>
		</>
	)
}

const styles = StyleSheet.create({
	// container: {
	// 	backgroundColor: theme.colors.white,
	// 	borderWidth: horizontalScale(1),
	// 	borderRadius: moderateScale(9),
	// 	borderColor: theme.colors.background,
	// },
	modelText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		color: theme.colors.darkGray,
	},
	title: {
		color: theme.colors.darkGray,
	},
	light: {
		fontFamily: theme.fonts.spoqaHanSansNeo.light,
	},
	marginRight: {
		marginRight: horizontalScale(5),
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
	font14: {
		fontSize: moderateScale(14),
	},
})
