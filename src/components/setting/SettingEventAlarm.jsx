import React, { useCallback, useState } from 'react'
import Paragraph from '../ui/text/Paragraph'
import styled from 'styled-components/native'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { theme } from '@/theme'
import Checkbox from '../ui/checkbox/Checkbox'
import { Platform, StyleSheet } from 'react-native'
import SmallText from '../ui/text/SmallText'
import Row from '../ui/view/Row'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useFocusEffect } from '@react-navigation/core'
import { GET_ALARM_CHECK, PUT_ALARM_SELECTED } from '@/core/store/api/create/alarmCreate'
import { useAlarmContext } from '@/core/store/api/providers/AlarmApiProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import Loading from '../ui/Loading'
import moment from 'moment'
import { CheckSvg, UnCheckSvg } from '@util/svgUtil'
import Left from '../ui/view/Left'
import Right from '../ui/view/Right'

const Container = styled.View`
	flex: 1;
	background-color: ${theme.colors.background};
	padding: ${verticalScale(16)}px ${horizontalScale(24)}px;
	border-color: ${theme.colors.background};
	border-width: ${moderateScale(1)}px;
	border-radius: ${moderateScale(5)}px;
`

const Contents = styled.View`
	background-color: ${theme.colors.white};
`

const Pressable = styled.Pressable`
	flex-direction: row;
`

const MarketingView = styled.View`
	padding: ${verticalScale(17)}px ${horizontalScale(16)}px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`

const Line = styled.View`
	position: absolute;
	width: 100%;
	top: ${({ top }) => verticalScale(top)}px;
	border-bottom-width: ${moderateScale(1)}px;
	border-bottom-color: ${theme.colors.line};
`

const CheckView = styled.View`
	flex-direction: column;
	padding: ${verticalScale(17)}px ${horizontalScale(16)}px;
`

const ItemView = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	/* padding-bottom: ${verticalScale(16)}px; */
`

// const Description = styled.View`
// 	align-self: flex-start;
// 	padding: ${verticalScale(16)}px ${horizontalScale(16)}px ${verticalScale(16)}px ${horizontalScale(16)}px;
// `

// const Dot = styled.View`
// 	width: ${moderateScale(3)}px;
// 	height: ${moderateScale(3)}px;
// 	border-radius: ${moderateScale(1.5)}px;
// 	background-color: ${theme.colors.text};
// 	top: ${moderateScale(10)}px;
// `

// const Interval = styled.View`
// 	padding-right: ${({ right }) => (right ? right : 0)}px;
// 	padding-left: ${({ left }) => (left ? left : 0)}px;
// 	padding-top: ${({ top }) => (top ? top : 0)}px;
// 	padding-bottom: ${({ bottom }) => (bottom ? bottom : 0)}px;
// `

const AlertContainer = styled.View`
	justify-content: center;
`

const AlertTitleView = styled.View`
	flex-direction: row;
`

const AlertParaView = styled.View`
	flex-direction: column;
`

const PUSH_TYPE = {
	ALL: 'SMS/Push/Email',
	SMS: 'SMS',
	EMAIL: 'Email',
	PUSH: 'Push',
}

const initialCheckValue = {
	marketing: false,
	sms: false,
	push: false,
	email: false,
}

function BigCheckImg() {
	return <CheckSvg width={moderateScale(16)} height={moderateScale(12)} />
}

function BigUnCheckImg() {
	return <UnCheckSvg width={moderateScale(64)} height={moderateScale(48)} />
}

function SmallCheckImg() {
	return <CheckSvg width={moderateScale(12.7)} height={moderateScale(11.2)} />
}

function SmallUnCheckImg() {
	return <UnCheckSvg width={moderateScale(40.65)} height={moderateScale(33.9)} />
}

export default function SettingEventAlarm() {
	const [check, setCheck] = useState(initialCheckValue)
	const { $alert } = useAlert()
	const { state: alarmState, dispatch: alarmDispatch } = useAlarmContext()
	const { loading: checkLoading } = alarmState.alarmCheck
	const { loading: selectedLoading } = alarmState.alarmSelected
	const { userState } = useUser()

	useFocusEffect(
		useCallback(() => {
			setCheck(initialCheckValue)
		}, []),
	)

	useFocusEffect(
		useCallback(() => {
			getAlarmCheck(null)
		}, [userState.id]),
	)

	/*
	 * 알림 체크 확인 Api call
	 */
	async function getAlarmCheck(pushType) {
		if (userState.id) {
			try {
				const response = await GET_ALARM_CHECK(alarmDispatch, { userId: userState.id })
				if (response?.data) {
					const resData = response.data
					if (resData.success && resData.data) {
						const { smsFlag, pushFlag, emailFlag, modDate } = resData.data
						const { sms, email, push, marketing } = checkFormatter({ smsFlag, pushFlag, emailFlag })
						setCheck({
							sms,
							push,
							email,
							marketing,
						})

						if (pushType !== null) {
							let isAgree = ''
							if (pushType === PUSH_TYPE.ALL) {
								isAgree = marketing === true ? true : false
							} else if (pushType === PUSH_TYPE.EMAIL) {
								isAgree = email === true ? true : false
							} else if (pushType === PUSH_TYPE.SMS) {
								isAgree = sms === true ? true : false
							} else if (pushType === PUSH_TYPE.PUSH) {
								isAgree = push === true ? true : false
							}

							handleAlert({ modDate, pushType, isAgree })
						}
					}
				}
			} catch (error) {
				console.log('alarm check error => ', error)
			}
		}
	}

	/*
	 * 선택 된 알림 Api call
	 */

	async function putAlarmSelected(selectedRequest) {
		if (userState.id) {
			try {
				const response = await PUT_ALARM_SELECTED(alarmDispatch, {
					userId: userState.id,
					smsFlag: selectedRequest.sms ? 'Y' : 'N',
					emailFlag: selectedRequest.email ? 'Y' : 'N',
					pushFlag: selectedRequest.push ? 'Y' : 'N',
				})

				if (response?.data) {
					const resData = response.data
					if (resData.data === true) {
						getAlarmCheck(selectedRequest.pushType)
					}
				}
			} catch (error) {
				console.log('alarm selected error => ', error)
			}
		}
	}

	function checkFormatter({ smsFlag, pushFlag, emailFlag }) {
		return {
			sms: smsFlag === 'Y' ? true : false,
			push: pushFlag === 'Y' ? true : false,
			email: emailFlag === 'Y' ? true : false,
			marketing: smsFlag === 'Y' && pushFlag === 'Y' && emailFlag === 'Y' ? true : false,
		}
	}

	/*
	 * 마케팅 수신 전체 동의
	 */
	function handlePressMarketingAgree() {
		if (!check.marketing === true) {
			putAlarmSelected({ push: true, sms: true, email: true, marketing: true, pushType: PUSH_TYPE.ALL })
		} else {
			putAlarmSelected({ push: false, sms: false, email: false, marketing: false, pushType: PUSH_TYPE.ALL })
		}
	}

	/*
	 * SMS 수신 동의
	 */
	function handlePressSmsAgree() {
		putAlarmSelected({ ...check, sms: !check.sms, pushType: PUSH_TYPE.SMS })
	}

	/*
	 * Push 수신 동의
	 */
	function handlePressPushAgree() {
		putAlarmSelected({ ...check, push: !check.push, pushType: PUSH_TYPE.PUSH })
	}

	/*
	 * Email 수신 동의
	 */
	function handlePressEmailAgree() {
		putAlarmSelected({ ...check, email: !check.email, pushType: PUSH_TYPE.EMAIL })
	}

	/*
	 * 알럿 핸들링
	 */
	function handleAlert({ modDate, pushType, isAgree }) {
		$alert({
			msg: () => {
				return (
					<AlertContainer>
						<AlertTitleView>
							<Paragraph>{'고객님은 '}</Paragraph>
							<Paragraph style={{ color: theme.colors.turquoise, marginBottom: verticalScale(5) }}>
								{moment(modDate).format('YYYY년 MM월 DD일')}
							</Paragraph>
						</AlertTitleView>
						<AlertParaView>
							<Row style={{ marginBottom: verticalScale(5) }}>
								<Paragraph style={{ color: theme.colors.turquoise }}>{pushType}</Paragraph>
								<Paragraph>{'혜택 알림'}</Paragraph>
							</Row>
							<Row>
								<Paragraph style={{ color: theme.colors.turquoise }}>
									{isAgree ? '동의' : '미동의'}
								</Paragraph>
								<Paragraph>{'하셨습니다.'}</Paragraph>
							</Row>
						</AlertParaView>
					</AlertContainer>
				)
			},
			onPress: (result) => {
				if (result) {
					console.log('확인')
				}
			},
		})
	}

	return (
		<>
			{(checkLoading || selectedLoading) && <Loading />}
			<Container>
				<Contents
					style={{
						...theme.shadow(1, 0, theme.colors.white, '#000'),
						borderColor: theme.colors.white,
						borderRadius: moderateScale(5),
						borderWidth: moderateScale(1),
					}}
				>
					<MarketingView>
						<Left>
							<Paragraph style={styles.paraText}>
								{'(선택) 마케팅 수신동의 및 혜택알림\n서비스 알림내용 동의'}
							</Paragraph>
						</Left>
						<Right>
							<Pressable onPress={() => handlePressMarketingAgree()}>
								<Checkbox
									onPress={() => handlePressMarketingAgree()}
									checked={check.marketing}
									checkStyle={{
										...styles.marketingChecked,
										...theme.shadow(Platform.OS === 'ios' ? 1.5 : 3),
									}}
									uncheckStyle={{
										...styles.marketingUnchecked,
										...theme.shadow(Platform.OS === 'ios' ? 1.5 : 3),
									}}
									customTrueImage={<BigCheckImg />}
									customFalseImage={<BigUnCheckImg />}
								/>
							</Pressable>
						</Right>
					</MarketingView>
					<Line top={71} />
					<CheckView>
						<ItemView style={{ paddingBottom: verticalScale(16) }}>
							<Left>
								<SmallText style={styles.smallText}>{'Push'}</SmallText>
							</Left>
							<Right>
								<Pressable onPress={() => handlePressPushAgree()}>
									<Checkbox
										onPress={() => handlePressPushAgree()}
										checked={check.push}
										checkStyle={{
											...styles.checked,
											...theme.shadow(Platform.OS === 'ios' ? 1.5 : 3),
										}}
										uncheckStyle={{
											...styles.unchecked,
											...theme.shadow(Platform.OS === 'ios' ? 1.5 : 3),
										}}
										customTrueImage={<SmallCheckImg />}
										customFalseImage={<SmallUnCheckImg />}
									/>
								</Pressable>
							</Right>
						</ItemView>
						<ItemView style={{ paddingBottom: verticalScale(16) }}>
							<Left>
								<SmallText style={styles.smallText}>{'SMS'}</SmallText>
							</Left>
							<Right>
								<Pressable onPress={() => handlePressSmsAgree()}>
									<Checkbox
										onPress={() => handlePressSmsAgree()}
										checked={check.sms}
										checkStyle={{
											...styles.checked,
											...theme.shadow(Platform.OS === 'ios' ? 1.5 : 3),
										}}
										uncheckStyle={{
											...styles.unchecked,
											...theme.shadow(Platform.OS === 'ios' ? 1.5 : 3),
										}}
										customTrueImage={<SmallCheckImg />}
										customFalseImage={<SmallUnCheckImg />}
									/>
								</Pressable>
							</Right>
						</ItemView>
						<ItemView>
							<Left>
								<SmallText style={styles.smallText}>{'Email'}</SmallText>
							</Left>
							<Right>
								<Pressable onPress={() => handlePressEmailAgree()}>
									<Checkbox
										onPress={() => handlePressEmailAgree()}
										checked={check.email}
										checkStyle={{
											...styles.checked,
											...theme.shadow(Platform.OS === 'ios' ? 1.5 : 3),
										}}
										uncheckStyle={{
											...styles.unchecked,
											...theme.shadow(Platform.OS === 'ios' ? 1.5 : 3),
										}}
										customTrueImage={<SmallCheckImg />}
										customFalseImage={<SmallUnCheckImg />}
									/>
								</Pressable>
							</Right>
						</ItemView>
					</CheckView>
					{/* <Line top={186} />
					<Description>
						<Row>
							<Dot />
							<Interval right={moderateScale(10)} />
							<Paragraph style={styles.paraText}>
								{'Push 알림 해제 시 정확한 정보 알림을\n안내 받으실 수 없습니다.'}
							</Paragraph>
						</Row>
						<Interval top={moderateScale(10)} />
						<Row>
							<Dot />
							<Interval right={moderateScale(10)} />
							<Paragraph style={styles.paraText}>
								{'선택항목에 동의하지 않으셔도 서비스 이용은\n가능합니다.'}
							</Paragraph>
						</Row>
					</Description> */}
				</Contents>
			</Container>
		</>
	)
}

const styles = StyleSheet.create({
	marketingChecked: {
		width: moderateScale(30),
		height: moderateScale(30),
		borderRadius: moderateScale(15),
		justifyContent: 'center',
		backgroundColor: theme.colors.white,
		borderColor: theme.colors.white,
		borderWidth: moderateScale(1),
		// shadowColor: '#000',
		// shadowOffset: {
		// 	width: 0,
		// 	height: verticalScale(1),
		// },
		// shadowOpacity: moderateScale(0.45),
		// shadowRadius: moderateScale(1),
		// elevation: 5,
	},
	marketingUnchecked: {
		width: moderateScale(30),
		height: moderateScale(30),
		borderRadius: moderateScale(15),
		justifyContent: 'center',
		backgroundColor: theme.colors.white,
		borderColor: theme.colors.white,
		borderWidth: 1,
		// shadowColor: '#000',
		// shadowOffset: {
		// 	width: 0,
		// 	height: verticalScale(1),
		// },
		// shadowOpacity: moderateScale(0.45),
		// shadowRadius: moderateScale(1),
		// elevation: 5,
	},
	checked: {
		width: moderateScale(22),
		height: moderateScale(22),
		borderRadius: moderateScale(11),
		justifyContent: 'center',
		backgroundColor: theme.colors.white,
		borderColor: theme.colors.white,
		borderWidth: moderateScale(1),
	},
	unchecked: {
		width: moderateScale(22),
		height: moderateScale(22),
		borderRadius: moderateScale(11),
		justifyContent: 'center',
		backgroundColor: theme.colors.white,
		borderColor: theme.colors.white,
		borderWidth: moderateScale(1),
	},
	paraText: {
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	smallText: {
		fontSize: moderateScale(14),
	},
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(1),
		},
		shadowOpacity: moderateScale(0.45),
		shadowRadius: moderateScale(1),
		elevation: 5,
	},
})
