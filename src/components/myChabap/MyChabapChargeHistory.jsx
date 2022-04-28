import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { FlatList, StyleSheet, View } from 'react-native'
import SmallText from '../ui/text/SmallText'
import Row from '../ui/view/Row'
import constants from '@/navigations/constants'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import { ArrowNextSvg } from '@util/svgUtil'
import { GET_PAYMENT_LIST, GET_PAYMENT_DETAIL } from '@/core/store/api/create/paymentCreate'
import { usePaymentContext } from '@/core/store/api/providers/PaymentApiProvider'
import moment from 'moment'
import Scrolling from '../ui/Scrolling'
import { getTotalTime } from '@/utils/date'
import userConst from '@/constants/userConst'

const { MY_CHABAP_TAB_FLOW, MY_CHABAP_CHARGE_HISTORY_DETAIL_SCREEN, MY_CHABAP_PAYMENT_SCREEN } = constants
const { USER_PERSONAL } = userConst

const Container = styled.View`
	flex: 1;
	background-color: #f8f8fa;
	padding: ${moderateScale(20)}px;
`

const Contents = styled.View`
	background-color: ${theme.colors.white};
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white};
	margin: ${verticalScale(10)}px 0;
`

const StationInfoView = styled.View`
	flex-direction: row;
	align-items: center;
	margin: ${verticalScale(15)}px 0;
`

const CarInfoView = styled.View`
	flex-direction: row;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: ${theme.colors.disabled};
	padding: ${moderateScale(12)}px;
	margin: ${verticalScale(5)}px 0 ${verticalScale(20)}px;
`

const Image = styled.Image`
	width: ${moderateScale(30)}px;
	height: ${moderateScale(30)}px;
`

const DetailButton = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	padding: ${moderateScale(15)}px;
`

const PaymentButton = styled.TouchableOpacity`
	flex-direction: row;
	justify-content: space-between;
`

const LeftView = styled.View`
	flex: 0.6;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.disabled};
	border-width: ${horizontalScale(1)}px;
	border-bottom_left-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.disabled};
	padding: ${moderateScale(15)}px;
`

const RightView = styled.View`
	flex: 0.4;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.turquoise};
	border-width: ${horizontalScale(1)}px;
	border-bottom_right-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.turquoise};
	padding: ${moderateScale(15)}px;
`

const DATA = []
for (let i = 0; i < 4; i++) {
	DATA.push(i)
}

export default function MyChabapChargeHistory() {
	const { navigate } = useNavigation()
	const [pageData, setPageData] = useState({ page: 0, size: 4 })
	const [isFull, setIsFull] = useState(false)
	//payment Api
	const { state: paymentState, dispatch: paymentDispatch } = usePaymentContext()
	const { loading: paymentLoading } = paymentState.paymentList
	const [paymentList, setPaymentList] = useState([])

	useFocusEffect(
		useCallback(() => {
			getPaymentList(pageData.page, 0)
		}, []),
	)

	// payment list
	async function getPaymentList(selectPage, userEvId) {
		try {
			const response = await GET_PAYMENT_LIST(paymentDispatch, {
				userEvId: userEvId,
				...pageData,
				page: selectPage,
			})
			const resData = response.data
			if (resData?.code === 'SUCCESS' && resData?.data) {
				console.log('get payment list success => ', response.data)

				const elements = resData.data.totalElements
				const contents = resData.data.content

				if (elements === paymentList.length) {
					setIsFull(true)
				} else {
					if (selectPage === 0) {
						setPaymentList(contents)
						setPageData({
							...pageData,
							page: 1,
						})
					} else {
						setPaymentList([...paymentList, ...contents])
						setPageData({
							...pageData,
							page: pageData.page + 1,
						})
					}
					setIsFull(false)
				}
			}
		} catch (e) {
			console.log('get payment list error => ', e)
		}
	}

	// payment detail
	async function getPaymentDetail(paymentId) {
		try {
			const response = await GET_PAYMENT_DETAIL(paymentDispatch, { paymentId })
			const resData = response.data
			return resData
		} catch (error) {
			console.log('payment detail error : ', error)
		}
	}

	// 미납요금 결제버튼 클릭
	function handlePressPaymentUnpaid(paymentId) {
		getPaymentDetail(paymentId).then((res) => {
			if (res?.code === 'SUCCESS' && res?.data) {
				navigate(MY_CHABAP_TAB_FLOW, {
					screen: MY_CHABAP_PAYMENT_SCREEN,
					params: {
						paymentId,
					},
				})
			}
		})
	}

	function handleLeadMore() {
		if (!isFull) {
			getPaymentList(pageData.page, 0)
		}
	}

	return (
		<Container>
			<FlatList
				style={styles.flatList}
				data={paymentList}
				keyExtractor={(item) => item.paymentId}
				renderItem={({ item: payment }) => (
					<Contents style={styles.shadow}>
						<View style={{ padding: moderateScale(15) }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								{payment.status === 'Y' ? (
									<SmallText>이용완료</SmallText>
								) : (
									<SmallText style={{ color: '#ff0000' }}>미납요금</SmallText>
								)}
								<SmallText style={{ fontSize: moderateScale(11), color: theme.colors.placeholder }}>
									{moment(payment.regDate).format('YYYY.MM.DD')}
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
									<SmallText style={styles.boldText}>{payment.stationName}</SmallText>
									<View style={{ margin: moderateScale(5) }} />
									<SmallText style={{ color: theme.colors.placeholder }}>{payment.addr1}</SmallText>
								</View>
							</StationInfoView>

							<CarInfoView>
								<Row style={{ flex: 1 }}>
									{payment.userTypeCd === USER_PERSONAL ? (
										<Image source={require('@assets/icons/personal.png')} />
									) : (
										<Image source={require('@assets/icons/corporation.png')} />
									)}

									<View style={{ margin: moderateScale(5) }} />

									<View style={{ flex: 1 }}>
										<SmallText style={{ fontWeight: 'bold' }}>{payment.model}</SmallText>
										<View style={{ margin: moderateScale(2) }} />
										<Row style={{ justifyContent: 'space-between' }}>
											<SmallText style={{ color: theme.colors.placeholder }}>
												{payment.nickname}
											</SmallText>
											<View style={{ margin: moderateScale(5) }} />
											<SmallText>{payment.carNum}</SmallText>
										</Row>
									</View>
								</Row>
							</CarInfoView>

							<View>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<SmallText style={{ fontWeight: 'bold' }}>충전 유형</SmallText>
									<SmallText style={{ color: theme.colors.placeholder }}>
										{payment.chargerType} (
										{payment.chargeSpeed === 'SLOW'
											? '완속'
											: payment.chargeSpeed === 'MEDIUM'
											? '중속'
											: payment.chargeSpeed === 'QUICK'
											? '급속'
											: null}
										)
									</SmallText>
								</View>
								<View style={{ margin: moderateScale(5) }} />
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<SmallText style={{ fontWeight: 'bold' }}>이용 시간</SmallText>
									<SmallText style={{ color: theme.colors.placeholder }}>
										{moment(payment.chgStartDate).format('HH:mm')}
										{' ~ '}
										{moment(payment.chgEndDate).format('HH:mm')}
										{'  |  '}
										{getTotalTime(payment.chgStartDate, payment.chgEndDate)}
									</SmallText>
								</View>
								<View style={{ margin: moderateScale(5) }} />
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<SmallText style={{ fontWeight: 'bold' }}>결제 비용</SmallText>
									<SmallText style={{ color: theme.colors.placeholder }}>
										{payment.amount}원
									</SmallText>
								</View>
								<View style={{ margin: moderateScale(5) }} />
							</View>
						</View>

						{payment.status === 'Y' ? (
							<DetailButton
								onPress={() =>
									navigate(MY_CHABAP_TAB_FLOW, {
										screen: MY_CHABAP_CHARGE_HISTORY_DETAIL_SCREEN,
										params: { paymentId: payment.paymentId },
									})
								}
							>
								<SmallText style={styles.detailText}>상세내역 보기</SmallText>
								<View style={{ margin: moderateScale(3) }} />
								<ArrowNextSvg width={moderateScale(8)} height={moderateScale(8)} />
							</DetailButton>
						) : (
							<PaymentButton onPress={() => handlePressPaymentUnpaid(payment.paymentId)}>
								<LeftView>
									<SmallText style={styles.boldText}>총 미납요금 </SmallText>
									<SmallText style={styles.unpaidText}>{payment.amount}원</SmallText>
								</LeftView>
								<RightView>
									<SmallText style={styles.buttonText}>결제하기</SmallText>
								</RightView>
							</PaymentButton>
						)}
					</Contents>
				)}
				onEndReached={() => handleLeadMore()}
				onEndReachedThreshold={0.6}
				refreshing={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
			/>
			{paymentLoading && <Scrolling />}
			{/* paymentList.length > 0 && */}
		</Container>
	)
}

const styles = StyleSheet.create({
	selectContainer: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: verticalScale(8),
		paddingBottom: verticalScale(8),
		paddingLeft: horizontalScale(15),
		paddingRight: horizontalScale(5),
	},
	flatList: {
		paddingTop: verticalScale(5),
		paddingBottom: verticalScale(5),
		paddingLeft: horizontalScale(10),
		paddingRight: horizontalScale(10),
	},
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
	detailText: {
		fontWeight: '900',
		fontSize: moderateScale(11),
		color: theme.colors.placeholder,
	},
	boldText: {
		fontWeight: 'bold',
		fontSize: moderateScale(15),
	},
	unpaidText: {
		color: '#ff0000',
		fontWeight: 'bold',
		fontSize: moderateScale(15),
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: moderateScale(15),
	},
})
