import SmallText from '@/components/ui/text/SmallText'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import { theme } from '@/theme'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import React, { useCallback, useRef } from 'react'
import { Animated, StyleSheet, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import constants from '@/navigations/constants'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import { usePaymentContext } from '@/core/store/api/providers/PaymentApiProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import { GET_PAYMENT_LIST } from '@/core/store/api/create/paymentCreate'
import { ArrowNextSvg } from '@/utils/svgUtil'
import moment from 'moment'
import { utils } from '@util/regularExp'
import { useError } from '@/core/store/common/providers/ErrorProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'

const { MY_CHABAP_TAB_FLOW, MY_CHABAP_CHARGE_HISTORY_SCREEN, MY_CHABAP_CHARGE_HISTORY_DETAIL_SCREEN } = constants

const Container = styled.View`
	padding-top: ${verticalScale(24)}px;
`

const Pressable = styled.Pressable`
	flex-direction: row;
	justify-content: space-between;
`

const Contents = styled.View``

const EmptyContents = styled.View`
	margin-top: ${verticalScale(8)}px;
	padding: ${verticalScale(48)}px ${horizontalScale(30)}px;
	background-color: ${theme.colors.white};
	align-items: center;
	justify-content: center;
	border-color: ${theme.colors.white};
	border-width: 1px;
	border-radius: ${moderateScale(5)}px;
`

const ItemView = styled.View`
	flex-direction: row;
	/* justify-content: space-between; */
	align-items: center;
	padding: ${verticalScale(5)}px ${horizontalScale(16)}px;
`

export default function MainRecentCharge({ NextImg }) {
	const scrollX = useRef(new Animated.Value(0)).current
	const navigation = useNavigation()
	const { $error } = useError()
	const { $alert } = useAlert()
	const { state: paymentState, dispatch: paymentDispatch } = usePaymentContext()
	const { data: paymentListData } = paymentState.paymentList
	const paymentList = paymentListData?.data?.content || []

	const {
		userState: { isLoggined, defaultUserEvId },
	} = useUser()
	const {
		index: { isFocused },
	} = navigation.getState()

	useFocusEffect(
		useCallback(() => {
			getPaymentList()
		}, [isLoggined, defaultUserEvId]),
	)

	// payment list
	async function getPaymentList() {
		if (isLoggined) {
			try {
				const response = await GET_PAYMENT_LIST(paymentDispatch, {
					userEvId: defaultUserEvId,
					page: 0,
					size: 10,
				})
				const resData = response.data

				if (resData?.code !== 'SUCCESS' && resData?.msg) {
					$alert(resData.msg)
				}
			} catch (e) {
				console.log('get payment list error => ', e)
				const errData = e?.data
				if (errData?.code) {
					const { code, msg } = errData
					setTimeout(() => {
						$error({
							code,
							msg,
							onPress: (result) => {
								if (result) {
									getPaymentList()
								}
							},
						})
					}, 1000)
				}
			}
		}
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

	// function getTimeToString(hours, minutes) {
	// 	if (hours > 0) {
	// 		return `${hours}시${minutes}분`
	// 	}

	// 	return `${minutes}분`
	// }

	function getDiffTime(start, end) {
		const startTime = moment(start)
		const endTime = moment(end)
		const hours = endTime.diff(startTime, 'hours')
		const minutes = endTime.diff(startTime, 'minutes')

		return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`
	}

	return (
		<Container>
			<Pressable
				style={{ paddingBottom: verticalScale(8) }}
				onPress={() => navigation.navigate(MY_CHABAP_TAB_FLOW, { screen: MY_CHABAP_CHARGE_HISTORY_SCREEN })}
			>
				<Left>
					<SmallText style={{ fontSize: moderateScale(16), fontFamily: theme.fonts.spoqaHanSansNeo.bold }}>
						최근 충전내역
					</SmallText>
				</Left>
				<Right style={{ alignSelf: 'center' }}>
					<NextImg />
				</Right>
			</Pressable>
			<Animated.ScrollView
				style={styles.animatedView}
				horizontal
				// pagingEnabled
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
				{paymentList?.length > 0 &&
					paymentList.map((item) => (
						<Contents style={styles.contents} key={item.paymentId}>
							<TouchableOpacity
								style={{ paddingTop: verticalScale(16), paddingBottom: verticalScale(16) }}
								onPress={() =>
									navigation.navigate(MY_CHABAP_TAB_FLOW, {
										screen: MY_CHABAP_CHARGE_HISTORY_DETAIL_SCREEN,
										params: {
											paymentId: item.paymentId,
										},
									})
								}
							>
								<ItemView style={{ ...styles.bottom, justifyContent: 'space-between' }}>
									<Left>
										<SmallText
											style={{
												color: isFocused ? theme.colors.notification : theme.colors.darkGray,
												fontFamily: theme.fonts.spoqaHanSansNeo.bold,
											}}
										>
											{moment(item.regDate).format('YYYY-MM-DD')}
										</SmallText>
									</Left>
									<Right style={{ paddingLeft: moderateScale(15) }}>
										<ArrowNextSvg width={6} height={10} fill={theme.colors.darkGray} />
									</Right>
								</ItemView>
								<ItemView style={styles.bottom}>
									<SmallText
										style={{
											color: isFocused ? theme.colors.notification : theme.colors.darkGray,
											...styles.fontSize16,
										}}
									>
										{truncate(item.stationName, 10)}
									</SmallText>
								</ItemView>
								<ItemView style={styles.bottom}>
									<SmallText
										style={{
											color: isFocused ? theme.colors.notification : theme.colors.darkGray,
											...styles.fontSize16,
										}}
									>
										{`${item.kwValue} kWh`}
									</SmallText>
									<SmallText style={styles.fontSize16}>{'   |   '}</SmallText>
									<SmallText style={{ ...styles.fontSize16, color: theme.colors.darkGray }}>
										{getDiffTime(item.chgStartDate, item.chgEndDate)}
									</SmallText>
								</ItemView>
								<ItemView>
									<SmallText
										style={{
											color: isFocused ? theme.colors.notification : theme.colors.turquoise,
											...styles.fontSize16,
										}}
									>
										{`${utils.format.number(item.amount)}원`}
									</SmallText>
								</ItemView>
							</TouchableOpacity>
						</Contents>
					))}
			</Animated.ScrollView>

			{paymentList?.length < 1 && (
				<EmptyContents>
					<SmallText>최근 충전 내역이 없습니다.</SmallText>
				</EmptyContents>
			)}
		</Container>
	)
}

const styles = StyleSheet.create({
	animatedView: {
		backgroundColor: theme.colors.background,
	},
	contents: {
		width: 210,
		backgroundColor: theme.colors.white,
		borderRadius: moderateScale(5),
		marginTop: verticalScale(8),
		marginRight: horizontalScale(10),
	},
	bottom: {
		paddingBottom: moderateScale(8),
	},
	padding: {
		padding: moderateScale(20),
	},
	fontSize16: {
		fontSize: moderateScale(16),
	},
})
