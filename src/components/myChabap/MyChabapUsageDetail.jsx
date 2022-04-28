import React, { useCallback } from 'react'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { StyleSheet, View } from 'react-native'
import SmallText from '../ui/text/SmallText'
import Row from '../ui/view/Row'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import constants from '@/navigations/constants'
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/core'
import { paymentDetailInitialState, usePaymentContext } from '@/core/store/api/providers/PaymentApiProvider'
import { GET_PAYMENT_DETAIL } from '@/core/store/api/create/paymentCreate'
import moment from 'moment'
import { useConnector } from '@/core/store/common/providers/ConnectorStatusProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import { getTotalTime } from '@/utils/date'
import userConst from '@/constants/userConst'

const { MY_CHABAP_TAB_FLOW, MY_CHABAP_PAYMENT_SCREEN } = constants

const { USER_PERSONAL } = userConst

const Container = styled.View`
	flex: 1;
	background-color: #f8f8fa;
	padding: ${moderateScale(24)}px;
`

const ScrollView = styled.ScrollView``

const Contents = styled.View`
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: ${theme.colors.white};
	padding: ${verticalScale(18)}px ${horizontalScale(18)}px ${verticalScale(42)}px;
`

const StationInfoView = styled.View`
	flex-direction: row;
	align-items: center;
	margin: ${verticalScale(15)}px 0;
`

const CarInfoView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.disabled};
	padding: ${verticalScale(10)}px ${horizontalScale(12)}px;
	margin: ${verticalScale(10)}px 0;
`

const Image = styled.Image`
	width: ${moderateScale(30)}px;
	height: ${moderateScale(30)}px;
`

const RowView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin: ${verticalScale(5)}px 0;
`

const ButtonView = styled.View`
	padding: 0 ${horizontalScale(24)}px ${verticalScale(40)}px;
`

const Button = styled.TouchableOpacity`
	flex-direction: row;
	justify-content: space-between;
`

const LeftView = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.disabled};
	border-top-start-radius: ${moderateScale(12)}px;
	border-bottom-start-radius: ${moderateScale(12)}px;
	padding: ${moderateScale(20)}px;
`

const RightView = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.turquoise};
	border-top-end-radius: ${moderateScale(12)}px;
	border-bottom-end-radius: ${moderateScale(12)}px;
	padding: ${moderateScale(20)}px;
`

export default function MyChabapUsageDetail() {
	const { navigate } = useNavigation()
	const {
		params: { id: paymentId },
	} = useRoute()
	const { state, dispatch } = usePaymentContext()
	const { getConnStatus } = useConnector()
	const {
		userState: { isLoggined },
	} = useUser()
	const { data: paymentDetailData } = state.paymentDetail
	const paymentDetail = paymentDetailData?.data || paymentDetailInitialState

	useFocusEffect(
		useCallback(() => {
			console.log('pamentid => ', paymentId)

			if (paymentId) getPaymentDetail()
		}, []),
	)

	async function getPaymentDetail() {
		if (isLoggined) {
			try {
				const response = await GET_PAYMENT_DETAIL(dispatch, { paymentId })
				// console.log('getPaymentDetail : ', response)
				const resData = response.data
				if (resData?.code === 'SUCCESS' && resData?.data) {
					getConnStatus(true)
				}
				if (!response?.data.success) {
					console.log('goBack()')
				}
			} catch (error) {
				console.log('payment detail error : ', error)
			}
		}
	}

	return (
		<>
			<Container>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Contents style={styles.shadow}>
						<SmallText style={{ color: theme.colors.placeholder }}>
							{moment(paymentDetail.regDate).format('YYYY.MM.DD')}
						</SmallText>

						<StationInfoView>
							<View style={{ height: '100%' }}>
								<Image
									style={{ width: moderateScale(35), height: moderateScale(35) }}
									source={require('@assets/icons/thunder.png')}
								/>
							</View>

							<View style={{ margin: moderateScale(5) }} />

							<View>
								<SmallText style={styles.boldText}>{paymentDetail.stationName}</SmallText>
								<View style={{ margin: moderateScale(5) }} />
								<SmallText style={styles.valueText}>{paymentDetail.addr1}</SmallText>
							</View>
						</StationInfoView>

						<CarInfoView>
							<Row style={{ alignItems: 'center' }}>
								{paymentDetail.userTypeCd === USER_PERSONAL ? (
									<Image source={require('@assets/icons/personal.png')} />
								) : (
									<Image source={require('@assets/icons/corporation.png')} />
								)}
								<View style={{ margin: moderateScale(5) }} />

								<View style={{ flex: 1 }}>
									<SmallText style={{ fontWeight: 'bold' }}>{paymentDetail.model}</SmallText>
									<View style={{ margin: moderateScale(2) }} />
									<Row style={{ justifyContent: 'space-between' }}>
										<SmallText style={{ color: theme.colors.placeholder }}>
											{paymentDetail.nickname}
										</SmallText>
										<View style={{ margin: moderateScale(5) }} />
										<SmallText>{paymentDetail.carNum}</SmallText>
									</Row>
								</View>
							</Row>
						</CarInfoView>

						<View style={{ marginTop: verticalScale(15), marginBottom: verticalScale(15) }}>
							<SmallText style={styles.boldText}>이용장소</SmallText>
						</View>
						<RowView>
							<SmallText style={styles.nameText}>충전소 명</SmallText>
							<SmallText style={styles.valueText}>{paymentDetail.stationName}</SmallText>
						</RowView>
						<RowView>
							<SmallText style={styles.nameText}>충전소 주소</SmallText>
							<SmallText style={styles.valueText}>{paymentDetail.addr1}</SmallText>
						</RowView>
						<RowView>
							<SmallText style={styles.nameText}>상세 주소</SmallText>
							<SmallText style={styles.valueText}>{paymentDetail.addr2}</SmallText>
						</RowView>

						<View style={{ marginTop: verticalScale(15), marginBottom: verticalScale(15) }}>
							<SmallText style={styles.boldText}>이용내역</SmallText>
						</View>
						<RowView>
							<SmallText style={styles.nameText}>충전기 번호</SmallText>
							<SmallText style={styles.valueText}>{paymentDetail.chargerNum}</SmallText>
						</RowView>
						<RowView>
							<SmallText style={styles.nameText}>충전기 유형</SmallText>
							<SmallText style={styles.valueText}>
								{paymentDetail.chargerType} (
								{paymentDetail.chargeSpeed === 'SLOW'
									? '완속'
									: paymentDetail.chargeSpeed === 'MEDIUM'
									? '중속'
									: paymentDetail.chargeSpeed === 'QUICK'
									? '급속'
									: null}
								)
							</SmallText>
						</RowView>
						<RowView>
							<SmallText style={styles.nameText}>전력량</SmallText>
							<SmallText style={styles.valueText}>{paymentDetail.electricalEnergy}kWh</SmallText>
						</RowView>
						<RowView>
							<SmallText style={styles.nameText}>평균 단가</SmallText>
							<SmallText style={styles.valueText}>{paymentDetail.unitPrice}원 / kWh</SmallText>
						</RowView>
						<RowView>
							<SmallText style={styles.nameText}>이용 시간</SmallText>
							<SmallText style={styles.valueText}>
								{moment(paymentDetail.chgStartDate).format('HH:mm')}
								{' ~ '}
								{moment(paymentDetail.chgEndDate).format('HH:mm')}
								{'  |  '}
								{getTotalTime(paymentDetail.chgStartDate, paymentDetail.chgEndDate)}
							</SmallText>
						</RowView>
					</Contents>
				</ScrollView>
			</Container>

			<ButtonView>
				<Button
					onPress={() => {
						navigate(MY_CHABAP_TAB_FLOW, {
							screen: MY_CHABAP_PAYMENT_SCREEN,
							params: {
								paymentId: paymentDetail.paymentId,
							},
						})
					}}
				>
					<LeftView>
						<SmallText style={styles.buttonText}>총 {paymentDetail.amount}원</SmallText>
					</LeftView>
					<RightView>
						<SmallText style={[styles.buttonText, { color: '#fff' }]}>이용금액 결제</SmallText>
					</RightView>
				</Button>
			</ButtonView>
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
	boldText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
	},
	nameText: {
		// fontSize: moderateScale(15),
	},
	valueText: {
		// fontSize: moderateScale(15),
		color: theme.colors.placeholder,
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
	},
})
