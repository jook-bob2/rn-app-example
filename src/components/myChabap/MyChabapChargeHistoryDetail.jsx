import React, { useState, useCallback } from 'react'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { StyleSheet, View } from 'react-native'
import SmallText from '../ui/text/SmallText'
import Row from '@/components/ui/view/Row'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { paymentDetailInitialState, usePaymentContext } from '@/core/store/api/providers/PaymentApiProvider'
import { GET_PAYMENT_DETAIL } from '@/core/store/api/create/paymentCreate'
import { useUser } from '@/core/store/common/providers/UserProvider'
import moment from 'moment'
import { getTotalTime } from '@/utils/date'
import userConst from '@/constants/userConst'

const { USER_PERSONAL } = userConst

const Container = styled.View`
	flex: 1;
	background-color: #f8f8fa;
	padding: ${moderateScale(22)}px;
`

const TabContents = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(0)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: ${theme.colors.white};
	margin-bottom: ${verticalScale(15)}px;
`

const UseTab = styled.TouchableOpacity`
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: ${({ tabState }) => (tabState === 'use' ? theme.colors.turquoise : theme.colors.white)};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: ${({ tabState }) => (tabState === 'use' ? theme.colors.turquoise : theme.colors.white)};
	padding: ${moderateScale(15)}px;
`

const PaymentTab = styled.TouchableOpacity`
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: ${({ tabState }) => (tabState === 'payment' ? theme.colors.turquoise : theme.colors.white)};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: ${({ tabState }) => (tabState === 'payment' ? theme.colors.turquoise : theme.colors.white)};
	padding: ${moderateScale(15)}px;
`

const Contents = styled.View`
	background-color: white;
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: white;
	padding: ${moderateScale(15)}px;
`

const RowView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin: ${verticalScale(5)}px 0;
`

const Image = styled.Image`
	width: ${moderateScale(30)}px;
	height: ${moderateScale(30)}px;
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
	padding: ${moderateScale(12)}px;
	margin: ${verticalScale(10)}px 0;
`

const PayDetailButton = styled.TouchableOpacity`
	flex: 1;
	align-items: center;
	justify-content: center;
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: ${theme.colors.white};
	padding: ${verticalScale(15)}px 0;
	margin: ${verticalScale(20)}px ${horizontalScale(8)}px;
`

export default function MyChabapChargeHistoryDetail() {
	const [tabState, setTabState] = useState('use')
	const {
		userState: { isLoggined },
	} = useUser()
	const {
		params: { paymentId },
	} = useRoute()

	const { state, dispatch } = usePaymentContext()
	const { data: paymentDetailData } = state.paymentDetail
	const paymentDetail = paymentDetailData?.data || paymentDetailInitialState

	useFocusEffect(
		useCallback(() => {
			if (paymentId) getPaymentDetail()
		}, [paymentId]),
	)

	async function getPaymentDetail() {
		if (isLoggined) {
			try {
				const response = await GET_PAYMENT_DETAIL(dispatch, { paymentId })
				console.log('getPaymentDetail : ', response)
			} catch (error) {
				console.log('payment detail error : ', error)
			}
		}
	}

	return (
		<Container>
			{/* Tab */}
			<TabContents style={styles.shadow}>
				<UseTab tabState={tabState} onPress={() => setTabState('use')}>
					<SmallText style={{ ...styles.tabText, color: tabState === 'use' ? 'white' : null }}>
						이용내역
					</SmallText>
				</UseTab>

				<PaymentTab tabState={tabState} onPress={() => setTabState('payment')}>
					<SmallText style={{ ...styles.tabText, color: tabState === 'payment' ? 'white' : null }}>
						결제내역
					</SmallText>
				</PaymentTab>
			</TabContents>

			{/* 이용내역 */}
			{tabState === 'use' && (
				<Contents style={styles.shadow}>
					<View>
						<SmallText style={{ fontSize: moderateScale(11), color: theme.colors.placeholder }}>
							{moment(paymentDetail.regDate).format('YYYY.MM.DD')}
						</SmallText>
					</View>

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

					<View style={{ marginTop: verticalScale(18), marginBottom: verticalScale(15) }}>
						<SmallText style={styles.boldText}>이용장소</SmallText>
					</View>

					<RowView>
						<SmallText>충전소 명</SmallText>
						<SmallText style={styles.valueText}>{paymentDetail.stationName}</SmallText>
					</RowView>
					<RowView>
						<SmallText>충전소 주소</SmallText>
						<SmallText style={styles.valueText}>{paymentDetail.addr1}</SmallText>
					</RowView>
					<RowView>
						<SmallText>상세 주소</SmallText>
						<SmallText style={styles.valueText}>{paymentDetail.addr2}</SmallText>
					</RowView>

					<View style={{ marginTop: verticalScale(18), marginBottom: verticalScale(15) }}>
						<SmallText style={styles.boldText}>이용내역</SmallText>
					</View>

					<RowView>
						<SmallText>충전기 번호</SmallText>
						<SmallText style={styles.valueText}>
							{paymentDetail.chargerModel}[{paymentDetail.chargerNum}]
						</SmallText>
					</RowView>
					<RowView>
						<SmallText>충전기 유형</SmallText>
						<SmallText style={styles.valueText}>
							{paymentDetail.chargerType}[
							{paymentDetail.chargeSpeed === 'SLOW'
								? '완속'
								: paymentDetail.chargeSpeed === 'MEDIUM'
								? '중속'
								: paymentDetail.chargeSpeed === 'QUICK'
								? '급속'
								: null}
							]
						</SmallText>
					</RowView>
					<RowView>
						<SmallText>전력량</SmallText>
						<SmallText style={styles.valueText}>{paymentDetail.electricalEnergy / 1000} kWh</SmallText>
					</RowView>
					<RowView>
						<SmallText>평균 단가</SmallText>
						<SmallText style={styles.valueText}>{paymentDetail.unitPrice}원 / kWh</SmallText>
					</RowView>
					<RowView>
						<SmallText>이용 시간</SmallText>
						<SmallText style={styles.valueText}>
							{moment(paymentDetail.chgStartDate).format('HH:mm')}
							{' ~ '}
							{moment(paymentDetail.chgEndDate).format('HH:mm')}
							{'  |  '}
							{getTotalTime(paymentDetail.chgStartDate, paymentDetail.chgEndDate)}
						</SmallText>
					</RowView>
				</Contents>
			)}

			{tabState === 'payment' && (
				<Contents style={styles.shadow}>
					<RowView>
						<SmallText style={styles.valueText}>총 이용 결제요금</SmallText>
						<Row>
							<SmallText style={styles.priceText}>{paymentDetail.amount}원</SmallText>
						</Row>
					</RowView>

					<RowView>
						<PayDetailButton style={{ backgroundColor: '#dbdbdb' }}>
							<SmallText>영수증 보기</SmallText>
						</PayDetailButton>

						<PayDetailButton style={{ backgroundColor: '#494949' }}>
							<SmallText style={{ color: '#fff' }}>내역서 메일 보내기</SmallText>
						</PayDetailButton>
					</RowView>

					<View style={{ marginTop: verticalScale(5), marginBottom: verticalScale(15) }}>
						<SmallText style={styles.boldText}>이용요금 상세</SmallText>
					</View>

					<View style={{ marginBottom: verticalScale(5) }}>
						<RowView>
							<SmallText>낮 시간 이용</SmallText>
							<SmallText style={styles.valueText}>7,580원</SmallText>
						</RowView>
						<SmallText style={styles.addText}>250원 X n시간 n분</SmallText>
					</View>

					<View style={{ marginTop: verticalScale(5), marginBottom: verticalScale(5) }}>
						<RowView>
							<SmallText>밤 시간이용</SmallText>
							<SmallText style={styles.valueText}>2,500원</SmallText>
						</RowView>
						<SmallText style={styles.addText}>300원 X n시간 n분</SmallText>
					</View>

					<View style={{ marginTop: verticalScale(5), marginBottom: verticalScale(5) }}>
						<RowView>
							<SmallText>주차료</SmallText>
							<SmallText style={styles.valueText}>800원</SmallText>
						</RowView>
					</View>

					<View style={{ marginTop: verticalScale(5) }}>
						<RowView>
							<SmallText>패널티 요금</SmallText>
							<SmallText style={{ color: theme.colors.danger }}>+ 300원</SmallText>
						</RowView>
						<SmallText style={styles.addText}>(이용시간 초과)</SmallText>
					</View>

					<View style={{ marginTop: verticalScale(5) }}>
						<RowView>
							<SmallText>포인트</SmallText>
							<SmallText style={styles.valueText}>0</SmallText>
						</RowView>
					</View>

					<View style={{ marginTop: verticalScale(5) }}>
						<RowView>
							<SmallText>상품권</SmallText>
							<SmallText style={styles.valueText}>-</SmallText>
						</RowView>
					</View>

					<View style={{ marginTop: verticalScale(5), marginBottom: verticalScale(5) }}>
						<RowView>
							<SmallText>할인쿠폰</SmallText>
							<SmallText style={{ color: theme.colors.turquoise }}>- 5,000원</SmallText>
						</RowView>
						<SmallText style={styles.addText}>(쿠폰명칭)</SmallText>
					</View>
				</Contents>
			)}
		</Container>
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
	tabText: {
		fontWeight: '900',
		fontSize: moderateScale(15),
	},
	boldText: {
		fontWeight: 'bold',
		fontSize: moderateScale(15),
	},
	valueText: {
		color: theme.colors.placeholder,
	},
	priceText: {
		fontWeight: '900',
		fontSize: moderateScale(22),
	},
	addText: {
		fontWeight: '900',
		fontSize: moderateScale(11),
		color: theme.colors.placeholder,
	},
})
