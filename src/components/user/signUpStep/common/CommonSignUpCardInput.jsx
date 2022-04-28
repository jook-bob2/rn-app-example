// import SmallText from '@/components/ui/text/SmallText'
// import { GET_WPAY_CARD_LIST } from '@/core/store/api/create/inicisCreate'
// import { GET_USER_WPAY_CHECK } from '@/core/store/api/create/userCreate'
// import { useInicisContext } from '@/core/store/api/providers/InicisApiProvider'
// import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
// import constants from '@/navigations/constants'
// import { theme } from '@/theme'
// import { device, horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
// import { animatedStyles } from '@/utils/animations'
// import { useFocusEffect, useNavigation } from '@react-navigation/native'
// import WithLocalSvg, { IcChipSvg, PlusSvg } from '@util/svgUtil'
// import React, { useCallback, useEffect, useRef, useState } from 'react'
// import { Animated, Easing, StyleSheet, View } from 'react-native'
// import Carousel, { Pagination } from 'react-native-snap-carousel'
// import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'
// import styled from 'styled-components/native'

// const Container = styled.View`
// 	flex: 1;
// 	background-color: ${theme.colors.white};
// `
// const EmptyCardView = styled.TouchableOpacity`
// 	width: ${horizontalScale(device.width - 40)}px;
// 	height: ${verticalScale((device.width - 40) / 1.7)}px;
// 	background-color: ${theme.colors.background};
// 	border-width: ${horizontalScale(1)}px;
// 	border-radius: ${moderateScale(15)}px;
// 	border-color: ${theme.colors.line};
// 	border-style: dashed;
// 	padding: ${moderateScale(15)}px;
// 	margin: ${moderateScale(5)}px;
// `

// const AutoPayView = styled.View`
// 	width: 100%;
// 	height: ${verticalScale(116)}px;
// 	background-color: #f8f8fa;
// 	margin-bottom: ${horizontalScale(30)}px;
// 	border-top-width: ${moderateScale(1)}px;
// 	border-bottom-width: ${moderateScale(1)}px;
// 	border-top-color: #e8e8e8;
// 	border-bottom-color: #e8e8e8;
// 	padding-left: ${horizontalScale(32)}px;
// 	padding-right: ${horizontalScale(32)}px;
// 	padding-top: ${verticalScale(16)}px;
// 	padding-bottom: ${verticalScale(30)}px;
// `

// const AddCardView = styled.View`
// 	flex: 1;

// 	align-items: center;
// 	justify-content: center;
// `
// const CardView = styled.View`
// 	width: ${horizontalScale(device.width - 40)}px;
// 	height: ${verticalScale((device.width - 40) / 1.7)}px;
// 	background-color: #1e4592;
// 	border-width: ${horizontalScale(1)}px;
// 	border-radius: ${moderateScale(8)}px;
// 	border-color: ${theme.colors.white};
// 	padding: ${moderateScale(22)}px;
// 	margin: ${moderateScale(5)}px;
// `
// const CarouselView = styled.View`
// 	flex: 1;
// 	align-items: center;
// `
// const SwitchView = styled.View`
// 	align-items: flex-end;
// `
// const ToggleContainer = styled.View`
// 	width: ${horizontalScale(45)}px;
// 	height: ${verticalScale(28)}px;
// 	border-radius: ${moderateScale(20)}px;
// 	justify-content: center;
// `
// const ToggleWheel = styled(Animated.View)`
// 	width: ${horizontalScale(19)}px;
// 	height: ${verticalScale(19)}px;
// 	background-color: ${theme.colors.white};
// 	border-radius: 9.5px;
// `
// const SignInBtnView = styled.View`
// 	justify-content: flex-end;
// 	align-items: center;
// `
// const ConfirmButton = styled.TouchableOpacity`
// 	align-items: center;
// 	justify-content: center;
// 	width: 100%;
// 	height: ${verticalScale(50)}px;
// 	background-color: ${theme.colors.turquoise};
// 	border-color: ${theme.colors.white};
// 	flex-direction: row;
// `
// let sliderWidth = device.width
// let itemWidth = horizontalScale(device.width - 25)
// const { MY_CHABAP_TAB_FLOW, SIGN_IN_SCREEN, INICIS_WPAY_SIGN_UP_WEBVIEW_SCREEN, INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN } =
// 	constants
// export default function CommonSignUpCardInput() {
// 	const { navigate } = useNavigation()
// 	const isCarousel = useRef(null)
// 	const [carouselList, setCarouselList] = useState([])
// 	const [currentTab, setCurrentTab] = useState(0)
// 	const { reset } = useNavigation()
// 	const [wpayInfo, setWpayInfo] = useState({
// 		wpayToken: '',
// 		payMethod: '',
// 		bankCardCode: '',
// 	})
// 	const [isAutoPay, setIsAutoPay] = useState(false)
// 	const { dispatch: userDispatch } = useUserContext()
// 	const { state: inicisState, dispatch: inicisDispatch } = useInicisContext()
// 	const { data: wpayCardListData } = inicisState.wpayCardList
// 	const wpayCardList = wpayCardListData?.data || []
// 	const [aniValue] = useState(new Animated.Value(0))
// 	// wpay 가입여부 확인하고 wpay 카드 목록 api 호출
// 	useFocusEffect(
// 		useCallback(() => {
// 			getUserWpayCheck().then((res) => {
// 				if (res) {
// 					getWpayCardList()
// 				}
// 			})
// 		}, []),
// 	)
// 	useEffect(() => {
// 		setIsAutoPay(isAutoPay)
// 	}, [isAutoPay])
// 	const moveSwitchToggle = aniValue.interpolate({
// 		inputRange: [0, 1],
// 		outputRange: [4, 22],
// 	})
// 	Animated.timing(aniValue, {
// 		toValue: isAutoPay ? 1 : 0,
// 		duration: 200,
// 		easing: Easing.linear,
// 		useNativeDriver: true,
// 	}).start()

// 	// WPAY 가입 여부 확인 API
// 	async function getUserWpayCheck() {
// 		try {
// 			const response = await GET_USER_WPAY_CHECK(userDispatch)
// 			console.log(response)
// 			if (response?.data.success) {
// 				console.log(response.data)
// 				return response.data.data
// 			}
// 		} catch (error) {
// 			console.log('check user wpay error : ', error)
// 		}
// 	}

// 	// carousel 카드 리스트 세팅
// 	useFocusEffect(
// 		useCallback(() => {
// 			if (wpayCardList.length > 0) {
// 				setCarouselList([...wpayCardList, { wpayToken: '', payMethod: '', bankCardCode: '' }])

// 				const { wpayToken, payMethod, bankCardCode } = wpayCardList[0]
// 				setWpayInfo({
// 					...wpayInfo,
// 					wpayToken,
// 					payMethod,
// 					bankCardCode,
// 				})
// 			}
// 		}, [wpayCardList]),
// 	)
// 	function _renderItem({ item }) {
// 		console.log('1', item)
// 		return (
// 			<>
// 				{!item.wpayToken ? (
// 					<EmptyCardView onPress={() => handlePressAddCard()}>
// 						<AddCardView>
// 							<PlusSvg
// 								style={{ marginBottom: verticalScale(16) }}
// 								width={moderateScale(21)}
// 								height={moderateScale(21)}
// 							/>
// 							<SmallText>카드 추가 등록</SmallText>
// 						</AddCardView>
// 					</EmptyCardView>
// 				) : (
// 					<CardView style={styles.shadow}>
// 						<View style={{ flex: 1 }}>
// 							<SmallText style={styles.cardText}>{item.cardName}</SmallText>
// 						</View>
// 						<View style={{ flex: 1 }}>
// 							<IcChipSvg width={moderateScale(50)} height={moderateScale(50)} />
// 						</View>
// 						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
// 							<SmallText style={styles.cardText}>{item.bankCardNo}</SmallText>
// 						</View>
// 					</CardView>
// 				)}
// 			</>
// 		)
// 	}
// 	// WPAY 카드 추가 버튼 클릭 여기는 회원가입이라서 바꿔야됨
// 	function handlePressAddCard() {
// 		if (getUserWpayCheck()) {
// 			navigate(MY_CHABAP_TAB_FLOW, {
// 				screen: INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN,
// 			})
// 		} else {
// 			navigate(MY_CHABAP_TAB_FLOW, {
// 				screen: INICIS_WPAY_SIGN_UP_WEBVIEW_SCREEN,
// 			})
// 		}
// 	}

// 	// WPAY 결제수단(신용카드) 리스트 API
// 	async function getWpayCardList() {
// 		try {
// 			const response = await GET_WPAY_CARD_LIST(inicisDispatch)
// 			console.log('wpay card list api : ', response)
// 		} catch (error) {
// 			console.log('get wpayCardList api error : ', error)
// 		}
// 	}
// 	//유저 pinflag 업데이트
// 	function onSelectSwitch(value) {
// 		console.log(value)
// 		setIsAutoPay(value)
// 	}

// 	return (
// 		<>
// 			<Container>
// 				<View>
// 					<AutoPayView>
// 						<View style={styles.pwdToggleView}>
// 							<SmallText style={styles.headText}>결제 시 비밀번호 생략</SmallText>
// 							<SwitchView>
// 								<Pressable onPress={() => onSelectSwitch(!isAutoPay)}>
// 									<ToggleContainer
// 										style={{
// 											backgroundColor: isAutoPay ? theme.colors.turquoise : theme.colors.disabled,
// 										}}
// 									>
// 										<ToggleWheel
// 											style={[
// 												styles.toggleWheel,
// 												{ transform: [{ translateX: moveSwitchToggle }] },
// 											]}
// 										/>
// 									</ToggleContainer>
// 								</Pressable>
// 							</SwitchView>
// 						</View>
// 						<SmallText style={styles.subText}>안전한 결제를 위해 추가 확인이 필요한경우</SmallText>
// 						<SmallText style={styles.subText}>비밀번호를 요구할수 있습니다.</SmallText>
// 					</AutoPayView>
// 				</View>
// 				<View>
// 					<CarouselView>
// 						<Carousel
// 							ref={isCarousel}
// 							data={carouselList}
// 							renderItem={_renderItem}
// 							firstItem={currentTab}
// 							useScrollView={true}
// 							sliderWidth={sliderWidth}
// 							itemWidth={itemWidth}
// 							inactiveSlideShift={0}
// 							onSnapToItem={(index) => {
// 								setCurrentTab(index)
// 								const { wpayToken, payMethod, bankCardCode } = carouselList[index]
// 								setWpayInfo({
// 									...wpayInfo,
// 									wpayToken,
// 									payMethod,
// 									bankCardCode,
// 								})
// 							}}
// 							slideInterpolatedStyle={animatedStyles}
// 							enableMomentum={true}
// 							decelerationRate={0.9}
// 							inactiveSlideScale={1}
// 							inactiveSlideOpacity={0.1}
// 							activeSlideAlignment="start"
// 							containerCustomStyle={{ flex: 1, paddingLeft: moderateScale(20) }}
// 							slideStyle={{ flex: 1 }}
// 						/>
// 						<Pagination
// 							dotsLength={carouselList.length}
// 							activeDotIndex={currentTab}
// 							carouselRef={isCarousel}
// 							dotStyle={{
// 								width: moderateScale(10),
// 								height: moderateScale(10),
// 								borderRadius: moderateScale(5),
// 								marginHorizontal: 0,
// 								backgroundColor: 'rgba(0, 0, 0, 0.92)',
// 							}}
// 							inactiveDotOpacity={0.4}
// 							inactiveDotScale={0.6}
// 							tappableDots={true}
// 						/>
// 					</CarouselView>
// 					)
// 				</View>
// 			</Container>
// 			<SignInBtnView>
// 				<ConfirmButton onPress={() => reset({ routes: [{ name: SIGN_IN_SCREEN }] })} style={styles.registerBtn}>
// 					<SmallText style={styles.buttonText}>시작하기</SmallText>
// 				</ConfirmButton>
// 			</SignInBtnView>
// 		</>
// 	)
// }

// const styles = StyleSheet.create({
// 	underLine: {
// 		borderColor: theme.colors.disabled,
// 		borderBottomWidth: moderateScale(1),
// 		marginTop: verticalScale(10),
// 		marginBottom: verticalScale(10),
// 	},

// 	cardText: {
// 		fontWeight: '500',
// 		fontSize: moderateScale(18),
// 		color: '#fff',
// 	},

// 	addSmallText: {
// 		marginTop: verticalScale(16),
// 		fontSize: moderateScale(14),
// 		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
// 	},
// 	pwdToggleView: {
// 		flexDirection: 'row',
// 		marginBottom: verticalScale(15),
// 		justifyContent: 'space-between',
// 	},
// 	headText: {
// 		fontSize: moderateScale(14),
// 		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
// 	},
// 	subText: {
// 		marginTop: verticalScale(1),
// 		fontSize: moderateScale(12),
// 		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
// 		color: theme.colors.darkGray,
// 	},
// 	registerBtn: {
// 		alignSelf: 'center',
// 		backgroundColor: theme.colors.turquoise,
// 	},
// 	buttonText: {
// 		fontWeight: 'bold',
// 		fontSize: moderateScale(16),
// 		color: theme.colors.white,
// 		marginLeft: verticalScale(8),
// 	},
// })
