import { GET_WPAY_CARD_LIST, POST_WPAY_CARD_MAIN, POST_WPAY_CARD_REMOVE } from '@/core/store/api/create/inicisCreate'
import { GET_USER_WPAY_CHECK, PATCH_PIN_FLAG } from '@/core/store/api/create/userCreate'
import { useInicisContext } from '@/core/store/api/providers/InicisApiProvider'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useBackColor } from '@/core/store/common/providers/BackColorProvider'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { device, horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { animatedStyles } from '@/utils/animations'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { IcChipSvg, PlusSvg } from '@util/svgUtil'
import React, { useCallback, useRef, useState } from 'react'
import { Animated, Easing, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'
import styled from 'styled-components/native'
import Loading from '../ui/Loading'
import SmallText from '../ui/text/SmallText'
import Left from '../ui/view/Left'
import Right from '../ui/view/Right'

const Container = styled.View`
	flex: 1;
	background-color: ${theme.colors.white};
`
const EmptyCardView = styled.TouchableOpacity`
	width: ${Platform.OS === 'android' ? horizontalScale(device.width - 40) : horizontalScale(device.width - 80)}px;
	height: ${Platform.OS === 'android'
		? verticalScale((device.height - 40) / 4)
		: horizontalScale(device.height - 40) / 4}px;
	background-color: ${theme.colors.background};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(15)}px;
	border-color: #dbdbdb;
	border-style: dashed;
`

const CardView = styled.View`
	width: ${Platform.OS === 'android' ? horizontalScale(device.width - 40) : horizontalScale(device.width - 80)}px;
	height: ${Platform.OS === 'android'
		? verticalScale((device.height - 40) / 4)
		: horizontalScale(device.height - 40) / 4}px;
	background-color: #1e4592;
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(15)}px;
	border-color: ${theme.colors.white};
	padding: ${moderateScale(22)}px;
	//	margin: ${moderateScale(5)}px;
`

// const ApplyNewCardView = styled.TouchableOpacity`
// 	width: ${horizontalScale(device.width - 40)}px;
// 	height: ${verticalScale((device.width - 40) / 1.7)}px;
// 	background-color: ${theme.colors.background};
// 	border-width: ${horizontalScale(1)}px;
// 	border-radius: ${moderateScale(15)}px;
// 	border-color: ${theme.colors.line};
// 	padding: ${moderateScale(15)}px;
// 	margin: ${moderateScale(5)}px;
// 	align-self: center;
// `

const AutoPayView = styled.View`
	width: 100%;
	height: ${verticalScale(116)}px;
	background-color: #f8f8fa;
	margin-bottom: ${horizontalScale(30)}px;
	border-top-width: ${moderateScale(1)}px;
	border-bottom-width: ${moderateScale(1)}px;
	border-top-color: #e8e8e8;
	border-bottom-color: #e8e8e8;
	padding-left: ${horizontalScale(32)}px;
	padding-right: ${horizontalScale(32)}px;
	padding-top: ${verticalScale(16)}px;
	padding-bottom: ${verticalScale(30)}px;
`

const AddCardView = styled.View`
	flex: 1;
	border-radius: ${moderateScale(15)}px;
	background-color: ${theme.colors.background};
	align-items: center;
	justify-content: center;
`

const MyCardInfoView = styled.View`
	width: ${Platform.OS === 'android' ? horizontalScale(device.width - 50) : horizontalScale(device.width - 100)}px;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 0 ${horizontalScale(10)}px;
	//background-color: ${theme.colors.darkGray};
	margin-top: ${verticalScale(10)}px;
`

const CarouselView = styled.View`
	background-color: ${theme.colors.white};
	border-radius: ${moderateScale(15)}px;
	align-self: center;
`
const SwitchView = styled.View`
	align-items: flex-end;
`
const ToggleContainer = styled.View`
	width: ${horizontalScale(45)}px;
	height: ${verticalScale(28)}px;
	border-radius: ${moderateScale(20)}px;
	justify-content: center;
`
const ToggleWheel = styled(Animated.View)`
	width: ${horizontalScale(19)}px;
	height: ${verticalScale(19)}px;
	background-color: ${theme.colors.white};
	border-radius: 9.5px;
`
const Footer = styled.View`
	align-items: center;
	justify-content: flex-end;
	/* background-color: ${theme.colors.white}; */
`
const ConfirmButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 90%;
	height: ${verticalScale(55)}px;
	background-color: ${theme.colors.turquoise};
	border-color: ${theme.colors.white};
	border-radius: ${moderateScale(8)}px;
	border-width: ${moderateScale(1)}px;
	flex-direction: row;
	margin-bottom: ${verticalScale(40)}px;
`

const Image = styled.Image`
	width: ${moderateScale(40)}px;
	height: ${moderateScale(40)}px;
`

let sliderWidth = device.width
let itemWidth = Platform.OS === 'ios' ? horizontalScale(device.width - 67) : horizontalScale(device.width - 20)

const {
	MY_CHABAP_TAB_FLOW,
	INICIS_WPAY_SIGN_UP_WEBVIEW_SCREEN,
	INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN,
	MY_INFO_CHANGE_CARD_INFO_SCREEN,
	MAIN_TAB_FLOW,
} = constants

export default function MyInfoChangeCardInfo() {
	const { navigate, reset } = useNavigation()
	const isCarousel = useRef(null)
	const [carouselList, setCarouselList] = useState([])
	const [currentTab, setCurrentTab] = useState(0)

	const [wpayInfo, setWpayInfo] = useState({
		wpayToken: '',
		payMethod: '',
		bankCardCode: '',
	})

	const { dispatch: myInfoDispatch } = useUserContext()
	const { state: inicisState, dispatch: inicisMyDispatch } = useInicisContext()
	const { dispatch: cardRemoveDispatch } = useInicisContext()
	const { loading: cardListLoad, data: wpayCardListData } = inicisState.wpayCardList
	const wpayCardList = wpayCardListData?.data || []

	const [isAutoPay, setIsAutoPay] = useState(false)
	const [aniValue] = useState(new Animated.Value(0))
	const { $confirm } = useConfirm()
	const { $alert } = useAlert()
	const [newMember, setNewMember] = useState(false)
	const { userState, setUserInfo } = useUser()

	const { params } = useRoute()
	const { setBottomColor } = useBackColor()

	const { dispatch: pinFlagDispatch } = useUserContext()

	useFocusEffect(
		useCallback(() => {
			// 회원의 pinFlag에 맞게 switch 세팅
			setIsAutoPay(userState.pinFlag === 'Y' ? false : true)

			// wpay 가입여부 확인하고 wpay 카드 목록 api 호출
			getUserWpayCheck().then((res) => {
				if (res) {
					getWpayCardList()

					setNewMember(params?.data?.isNewMember)
				} else {
					setNewMember(params?.isNewMember)
				}
			})
		}, [userState.isLoggined]),
	)

	useFocusEffect(
		useCallback(() => {
			newMember ? setBottomColor(theme.colors.turquoise) : setBottomColor(theme.colors.white)
		}, [params]),
	)

	const moveSwitchToggle = aniValue.interpolate({
		inputRange: [0, 1],
		outputRange: [4, 20],
	})

	Animated.timing(aniValue, {
		toValue: isAutoPay ? 1 : 0,
		duration: 200,
		easing: Easing.linear,
		useNativeDriver: true,
	}).start()

	// WPAY 가입 여부 확인 API
	async function getUserWpayCheck() {
		if (userState.isLoggined) {
			try {
				const response = await GET_USER_WPAY_CHECK(myInfoDispatch)
				console.log('wpay check: ', response)
				if (response?.data.success) {
					// setIsWpayCheck(response.data.data)
					return response.data.data
				}
			} catch (error) {
				console.log('check user wpay error : ', error)
			}
		}
	}

	// carousel 카드 리스트 세팅
	useFocusEffect(
		useCallback(() => {
			setCarouselList([...wpayCardList, { wpayToken: '', payMethod: '', bankCardCode: '' }])

			if (wpayCardList.length > 0) {
				const { wpayToken, payMethod, bankCardCode, majYn } = wpayCardList[0]
				setWpayInfo({
					...wpayInfo,
					wpayToken,
					payMethod,
					bankCardCode,
				})
				// 첫카드등록시 메인카드
				if (wpayCardList.length === 1 && majYn === 'N') {
					handleMayjorCard(wpayToken)
				}
			} else {
				patchPinFlag(false)
			}
		}, [wpayCardList]),
	)

	function _renderItem({ item }) {
		return (
			<>
				{!item.wpayToken ? (
					<EmptyCardView onPress={() => handlePressAddCard()}>
						<AddCardView style={{ ...theme.shadow() }}>
							<PlusSvg width={moderateScale(21)} height={moderateScale(21)} />
							<SmallText style={{ marginTop: verticalScale(16) }}>카드 추가 등록</SmallText>
						</AddCardView>
					</EmptyCardView>
				) : (
					<>
						<CardView style={styles.shadow}>
							<View style={{ position: 'absolute', padding: moderateScale(22) }}>
								<SmallText style={styles.cardText}>{item.cardName}</SmallText>
							</View>
							<View style={{ flex: 1, justifyContent: 'center' }}>
								<IcChipSvg width={moderateScale(50)} height={moderateScale(50)} />
							</View>
						</CardView>

						<MyCardInfoView>
							<Left>
								<SmallText style={styles.cardInfoText}>
									{item.cardName}({item.bankCardNo})
								</SmallText>
							</Left>

							<Right style={{ left: horizontalScale(24) }}>
								{item.majYn === 'Y' ? (
									<Image source={require('@assets/icons/bookmark_checked.png')} />
								) : (
									<TouchableOpacity onPress={() => handleMayjorCard(item.wpayToken)}>
										<Image source={require('@assets/icons/bookmark_unchecked.png')} />
									</TouchableOpacity>
								)}

								<TouchableOpacity onPress={() => handleDeleteCard(item.wpayToken)}>
									<Image source={require('@assets/icons/garbage.png')} />
								</TouchableOpacity>
							</Right>
						</MyCardInfoView>
					</>
				)}
			</>
		)
	}

	// WPAY 카드 추가 버튼 클릭
	function handlePressAddCard() {
		console.log('isNewMember', params?.isNewMember)
		getUserWpayCheck().then((res) => {
			if (res) {
				navigate(MY_CHABAP_TAB_FLOW, {
					screen: INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN,
					params: {
						returnUrl: MY_INFO_CHANGE_CARD_INFO_SCREEN,
						isNewMember: newMember,
					},
				})
			} else {
				navigate(MY_CHABAP_TAB_FLOW, {
					screen: INICIS_WPAY_SIGN_UP_WEBVIEW_SCREEN,
					params: {
						returnUrl: MY_INFO_CHANGE_CARD_INFO_SCREEN,
						isNewMember: newMember,
					},
				})
			}
		})
	}

	function handlePressStart() {
		reset({
			routes: [
				{
					name: MAIN_TAB_FLOW,
				},
			],
		})
	}
	// WPAY 결제수단(신용카드) 리스트 API
	async function getWpayCardList() {
		if (userState.isLoggined) {
			try {
				const response = await GET_WPAY_CARD_LIST(inicisMyDispatch)
				console.log('wpay card list api : ', response)
			} catch (error) {
				console.log('get wpayCardList api error : ', error)
			}
		}
	}
	//유저 pinflag 업데이트
	function onSelectSwitch(value) {
		if (wpayCardList.length < 1) {
			$alert('카드를 먼저 등록해주세요.')
		} else {
			patchPinFlag(value)
		}
	}

	//유저 pinflag 업데이트
	async function patchPinFlag(value) {
		try {
			await PATCH_PIN_FLAG(pinFlagDispatch, {
				id: userState.id,
				flag: value,
			}).then(() => {
				setIsAutoPay(value)
				setUserInfo({
					...userState,
					pinFlag: value ? 'N' : 'Y',
				})
			})
		} catch (error) {
			console.log('pinFlag error: ', error)
		}
	}

	//WPAY 결제수단(신용카드) 삭제 API
	async function handleDeleteCard(value) {
		$confirm({
			msg: '해당 카드를 삭제하시겠습니까?',
			cancelButtonName: '취소',
			confirmButtonName: '삭제',
			onPress: async (result) => {
				if (result) {
					try {
						const response = await POST_WPAY_CARD_REMOVE(cardRemoveDispatch, { wpayToken: value })

						if (response.data.data) {
							getUserWpayCheck().then((res) => {
								if (res) {
									getWpayCardList()
								}
							})
						} else {
							$alert('삭제 실패')
						}

						if (!response.data.success) {
							$alert(response.data.msg)
						}
					} catch (error) {
						console.log('delete wpay error: ', error)
					}
				}
			},
		})
	}

	//WPAY 결제수단(신용카드) 대표카드로 설정 API
	async function handleMayjorCard(value) {
		try {
			const response = await POST_WPAY_CARD_MAIN(cardRemoveDispatch, { wpayToken: value })

			if (response.data.data) {
				getWpayCardList()
			}
			if (!response.data.success) {
				$alert(response.data.msg)
			}
		} catch (error) {
			console.log('main wpay error: ', error)
		}
	}

	return (
		<>
			{cardListLoad && <Loading />}
			<Container>
				<View>
					<AutoPayView>
						<View style={styles.pwdToggleView}>
							<SmallText style={styles.headText}>결제 시 비밀번호 생략</SmallText>
							<SwitchView>
								<Pressable onPress={() => onSelectSwitch(!isAutoPay)}>
									<ToggleContainer
										style={{
											backgroundColor: isAutoPay ? theme.colors.turquoise : theme.colors.disabled,
										}}
									>
										<ToggleWheel
											style={[
												styles.toggleWheel,
												{ transform: [{ translateX: moveSwitchToggle }] },
											]}
										/>
									</ToggleContainer>
								</Pressable>
							</SwitchView>
						</View>
						<SmallText style={styles.subText}>안전한 결제를 위해 추가 확인이 필요한경우</SmallText>
						<SmallText style={styles.subText}>비밀번호를 요구할수 있습니다.</SmallText>
					</AutoPayView>
				</View>
				<View style={{ flex: 1 }}>
					<CarouselView>
						<Carousel
							ref={isCarousel}
							data={carouselList}
							renderItem={_renderItem}
							firstItem={currentTab}
							useScrollView={true}
							sliderWidth={sliderWidth}
							itemWidth={itemWidth}
							inactiveSlideShift={0}
							onSnapToItem={(index) => {
								setCurrentTab(index)
								const { wpayToken, payMethod, bankCardCode } = carouselList[index]
								setWpayInfo({
									...wpayInfo,
									wpayToken,
									payMethod,
									bankCardCode,
								})
							}}
							slideInterpolatedStyle={animatedStyles}
							enableMomentum={true}
							decelerationRate={0.9}
							inactiveSlideScale={1}
							inactiveSlideOpacity={0.1}
							activeSlideAlignment="start"
							containerCustomStyle={{
								// paddingLeft: Platform.OS === 'android' ? horizontalScale(55) : 0,
								paddingHorizontal: Platform.OS === 'ios' ? horizontalScale(32.5) : horizontalScale(42),
							}}
							slideStyle={{ flex: 1 }}
						/>
					</CarouselView>
				</View>
			</Container>
			{params?.isNewMember === true ? (
				<Footer>
					<ConfirmButton onPress={() => handlePressStart()}>
						<SmallText style={styles.buttonText}>시작하기</SmallText>
					</ConfirmButton>
				</Footer>
			) : null}
		</>
	)
}

const styles = StyleSheet.create({
	underLine: {
		borderColor: theme.colors.disabled,
		borderBottomWidth: moderateScale(1),
		marginTop: verticalScale(10),
		marginBottom: verticalScale(10),
	},

	cardText: {
		fontWeight: '500',
		fontSize: moderateScale(18),
		color: '#fff',
	},

	addSmallText: {
		marginTop: verticalScale(16),
		fontSize: moderateScale(14),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	pwdToggleView: {
		flexDirection: 'row',
		marginBottom: verticalScale(15),
		justifyContent: 'space-between',
	},
	headText: {
		fontSize: moderateScale(14),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	subText: {
		marginTop: verticalScale(1),
		fontSize: moderateScale(12),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		color: theme.colors.darkGray,
	},
	cardInfoText: {
		fontSize: moderateScale(14),
		alignSelf: 'flex-start',
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		color: theme.colors.text,
	},

	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
	},
})
