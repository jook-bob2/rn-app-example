import { theme } from '@/theme'
import React, { useEffect, useState } from 'react'
import { Dimensions, Platform, StyleSheet } from 'react-native'
import SmallText from './text/SmallText'
import styled from 'styled-components/native'
import constants from '@/navigations/constants'
import { verticalScale, moderateScale } from '@theme/scaling'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import { PeopleSvg, InfoSvg, Cancel404Svg, StopHandSvg, Right405Svg } from '@util/svgUtil'
import { useChargeQueueContext } from '@/core/store/api/providers/ChargeQueueApiProvider'
import { PATCH_SEND_STEVE } from '@/core/store/api/create/chargeQueueCreate'
import { StatusCd } from '@/constants/chargeQueueConst'
import Loading from '@/components/ui/Loading'
import { useStationContext } from '@/core/store/api/providers/StationApiProvider'
import { useConnector } from '@/core/store/common/providers/ConnectorStatusProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import Paragraph from './text/Paragraph'
import UsageGuideInfoModal from './modal/UsageGuideInfoModal'
import FindRoadModal from './modal/FindRoadModal'
import { useLoading } from '@/core/store/common/providers/LoadingProvider'

const {
	AUTH_STACK_FLOW,
	SEARCH_TAB_FLOW,
	MY_CHABAP_TAB_FLOW,
	SIGN_IN_SCREEN,
	CHARGING_STATION_SEARCH_SCREEN,
	MY_CHABAP_MAIN_SCREEN,
	INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN,
} = constants

const win = Dimensions.get('window')
const winWidth = win.width
const circleWidth = Platform.OS === 'ios' ? winWidth / 5.2 : winWidth / 5.6

const Container = styled.ImageBackground`
	flex-grow: 0;
`

const Contents = styled.View`
	flex-direction: row;
	align-items: center;
`

const ContentLeft = styled.View`
	flex: 2.73;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`

const ContentCenter = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	margin: -1.5px -4.5px 0 0;
`

const ContentRight = styled.View`
	flex: 2.73;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`

const MapCircle = styled.View`
	width: ${circleWidth}px;
	height: ${circleWidth}px;
	border-width: 1px;
	border-color: ${theme.colors.turquoise};
	border-radius: ${circleWidth / 2}px;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.turquoise};
	bottom: ${verticalScale(28)}px;
`
const LogoImg = styled.Image`
	width: ${moderateScale(24)}px;
	height: ${moderateScale(30)}px;
	tint-color: ${theme.colors.white};
`

const TouchableOpacity = styled.TouchableOpacity`
	flex-direction: column;
	align-items: center;
`

const ConfirmView = styled.View`
	/* padding-top: ${verticalScale(20)}px; */
	justify-content: center;
	align-items: center;
`

const ConfirmTitleView = styled.View`
	/* padding-bottom: ${verticalScale(10)}px; */
	margin-bottom: ${verticalScale(8)}px;
`

const InfoCircle = styled.View`
	width: ${moderateScale(21)}px;
	height: ${moderateScale(21)}px;
	border-width: ${moderateScale(1)}px;
	border-color: ${theme.colors.text2};
	border-radius: ${moderateScale(10.5)}px;
	background-color: ${theme.colors.white};
	justify-content: center;
	align-items: center;
`

const Br = styled.View`
	padding: ${moderateScale(1)}px;
`

export default function TabBar({ state, descriptors, navigation, ...props }) {
	const { navigate } = navigation
	const key = navigation.getState()?.history[navigation.getState()?.history?.length - 1].key
	const tabShown = descriptors[key]?.options?.tabShown
	const [chargeState, setChargeState] = useState(0)
	const [findRoadModal, setFindRoadModal] = useState(false)
	const [guideModal, setGuideModal] = useState(false)

	const { $confirm } = useConfirm()
	const { $alert } = useAlert()
	const { getConnStatus, connectorState } = useConnector()
	const { state: chargeQueueState, dispatch: chargeQueueDispatch } = useChargeQueueContext()
	const { loading: chageQueueLoading } = chargeQueueState.sendSteve
	const { state: stationState } = useStationContext()
	const { loading: roadLoading } = stationState.findRoad
	const {
		showLoading,
		hiddenLoading,
		loadingState: { isLoading },
	} = useLoading()

	useEffect(() => {
		setChargeState(connectorState.status)
	}, [connectorState])

	function sendSteve(status) {
		setTimeout(async () => {
			try {
				const response = await PATCH_SEND_STEVE(chargeQueueDispatch, { status })
				const resData = response.data
				if (resData?.code === 'SUCCESS' && resData?.data) {
					if (status === StatusCd.COMPLETE) {
						showLoading()
						setTimeout(async () => {
							if (connectorState.status === 4) {
								// 10초가 지나도 연결상태가 충전중이라면 강제로 로딩 제거하고, 연결상태 재조회
								hiddenLoading()
								await getConnStatus(true)
							}
						}, 1000 * 10)
					} else {
						await getConnStatus(true)
					}
				} else if (resData?.code === 'ESVC057') {
					setTimeout(() => {
						$confirm({
							msg: () => {
								return (
									<ConfirmView>
										<ConfirmTitleView>
											<Paragraph>결제 정보가 없습니다.</Paragraph>
										</ConfirmTitleView>
										<SmallText>결제 방법을 등록하시겠습니까?</SmallText>
									</ConfirmView>
								)
							},
							cancelButtonName: '아니오',
							confirmButtonName: '예',
							onPress: (result) => {
								if (result) {
									navigate(MY_CHABAP_TAB_FLOW, {
										screen: INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN,
									})
								} else {
									console.log('로그인 안함!')
								}
							},
						})
					}, 1000)
				} else if (resData?.code && resData?.msg) {
					$alert(resData.msg)
				}
			} catch (error) {
				console.log('charge queue error => ', error)
			}
		}, 500)
	}

	function handlePressMiddle() {
		if (chargeState === 0) {
			signConfirm()
		} else if (chargeState === 1) {
			navigate(SEARCH_TAB_FLOW, { screen: CHARGING_STATION_SEARCH_SCREEN })
		} else if (chargeState === 2 || chargeState === 3 || chargeState === 4) {
			setFindRoadModal(true)
		}
	}

	function signConfirm() {
		$confirm({
			msg: () => {
				return (
					<ConfirmView>
						<ConfirmTitleView>
							<Paragraph>로그인이 필요한 서비스입니다.</Paragraph>
						</ConfirmTitleView>
						<SmallText>로그인 페이지로 이동하시겠습니까?</SmallText>
					</ConfirmView>
				)
			},
			cancelButtonName: '아니오',
			confirmButtonName: '예',
			onPress: (result) => {
				if (result) {
					navigate(AUTH_STACK_FLOW, { screen: SIGN_IN_SCREEN })
				} else {
					console.log('로그인 안함!')
				}
			},
		})
	}

	function handlePressRight() {
		if (chargeState === 0 || chargeState === 1) {
			// 비로그인 혹은 로그인 상태
			setGuideModal(true)
		} else if (chargeState === 2) {
			// 대기열 상태
			setTimeout(() => {
				$confirm({
					msg: () => {
						return (
							<ConfirmView>
								<ConfirmTitleView>
									<Paragraph>대기열을 취소하시겠습니까?</Paragraph>
								</ConfirmTitleView>
								<SmallText>취소하시면 다음 대기자로 넘어갑니다.</SmallText>
							</ConfirmView>
						)
					},
					cancelButtonName: '아니오',
					confirmButtonName: '취소하기',
					onPress: (result) => {
						if (result) {
							sendSteve(StatusCd.CANCELED)
						} else {
							console.log('대기열 취소 안함!')
						}
					},
				})
			}, 200)
		} else if (chargeState === 3) {
			// 대기열 순번 돌아 왔을 때 상태
			setTimeout(() => {
				$confirm({
					msg: () => {
						return (
							<ConfirmView>
								<ConfirmTitleView>
									<Paragraph>대기열을 취소하시겠습니까?</Paragraph>
								</ConfirmTitleView>
								<SmallText>취소하시면 다음 대기자로 넘어갑니다.</SmallText>
							</ConfirmView>
						)
					},
					cancelButtonName: '아니오',
					confirmButtonName: '취소하기',
					onPress: (result) => {
						if (result) {
							sendSteve(StatusCd.CANCELED)
						} else {
							console.log('예약 취소 안함!')
						}
					},
				})
			}, 200)
		} else if (chargeState === 4) {
			// 충전 중 상태
			setTimeout(() => {
				$confirm({
					msg: () => {
						return (
							<ConfirmView>
								<ConfirmTitleView>
									<Paragraph>충전을 중단하시겠습니까?</Paragraph>
								</ConfirmTitleView>
								<SmallText>충전을 중단하시면 이용요금이 확정됩니다.</SmallText>
							</ConfirmView>
						)
					},
					cancelButtonName: '아니오',
					confirmButtonName: '중단하기',
					onPress: (result) => {
						if (result) {
							sendSteve(StatusCd.COMPLETE)
						} else {
							console.log('충전 그만하기 취소!')
						}
					},
				})
			}, 200)
		}
	}

	return (
		<>
			{(chageQueueLoading || roadLoading || isLoading) && <Loading />}
			{tabShown === true && (
				<>
					<Container style={styles.container} source={require('@assets/images/hook.png')}>
						<Contents>
							<ContentLeft style={{ bottom: Platform.OS === 'ios' ? moderateScale(2) : 0 }}>
								<TouchableOpacity
									onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: MY_CHABAP_MAIN_SCREEN })}
								>
									<PeopleSvg width={moderateScale(18)} height={moderateScale(18)} />
									<Br />
									<Br />
									<SmallText style={styles.text}>{'마이차밥'}</SmallText>
								</TouchableOpacity>
							</ContentLeft>
							<ContentCenter
								style={{
									...styles.marginBottom,
								}}
							>
								<TouchableOpacity onPress={() => handlePressMiddle()}>
									{chargeState === 0 || chargeState === 1 ? (
										<MapCircle>
											<LogoImg source={require('@assets/images/logo_white.png')} />
											<Br />
											<Br />
											<SmallText style={styles.centerText}>{'차밥주기'}</SmallText>
										</MapCircle>
									) : (
										<MapCircle>
											<Right405Svg width={moderateScale(18)} height={moderateScale(22)} />
											<Br />
											<Br />
											<SmallText style={styles.centerText}>{'찾아가기'}</SmallText>
										</MapCircle>
									)}
								</TouchableOpacity>
							</ContentCenter>
							<ContentRight style={{ bottom: Platform.OS === 'ios' ? moderateScale(2) : 0 }}>
								{chargeState === 0 || chargeState === 1 ? (
									<TouchableOpacity onPress={() => handlePressRight()}>
										<InfoCircle>
											<InfoSvg width={moderateScale(3.3)} height={moderateScale(6.7)} />
										</InfoCircle>
										<Br />
										<Br />
										<SmallText style={styles.text}>이용가이드</SmallText>
									</TouchableOpacity>
								) : chargeState === 2 || chargeState === 3 ? (
									<TouchableOpacity onPress={() => handlePressRight()}>
										<Cancel404Svg width={moderateScale(20)} height={moderateScale(20)} />
										<Br />
										<SmallText style={styles.text}>취소</SmallText>
									</TouchableOpacity>
								) : chargeState === 4 ? (
									<TouchableOpacity onPress={() => handlePressRight()}>
										<StopHandSvg width={moderateScale(18)} height={moderateScale(20)} />
										<Br />
										<SmallText style={styles.text}>차밥 그만주기</SmallText>
									</TouchableOpacity>
								) : null}
							</ContentRight>
						</Contents>
					</Container>

					{/* 길찾기 모달 */}
					{findRoadModal === true && (
						<FindRoadModal
							findRoadModal={findRoadModal}
							setFindRoadModal={setFindRoadModal}
							signConfirm={signConfirm}
						/>
					)}

					{/* 이용 가이드 모달 */}
					{guideModal === true && (
						<UsageGuideInfoModal guideModal={guideModal} setGuideModal={setGuideModal} />
					)}
				</>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		// width: '100%',
		height: moderateScale(87),
		// height: verticalScale(tabBarHeight() + 70),
		// backgroundColor: theme.colors.white,
	},
	text: {
		color: theme.colors.darkGray,
		fontSize: moderateScale(12),
	},
	centerText: {
		color: theme.colors.white,
		fontSize: moderateScale(12),
		fontWeight: 'bold',
	},
	marginBottom: {
		marginBottom: verticalScale(10),
	},
	stepImage: {
		aspectRatio: 1 / 1.7,
	},
})
