import React, { useState, useRef, useCallback } from 'react'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import SmallText from '../ui/text/SmallText'
import Checkbox from '@/components/ui/checkbox/Checkbox'
import Select from '@/components/ui/select/Select'
import { RadioButton } from 'react-native-paper'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import { animatedStyles } from '@/utils/animations'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import constants from '@/navigations/constants'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import { GET_USER_WPAY_CHECK } from '@/core/store/api/create/userCreate'
import { useInicisContext } from '@/core/store/api/providers/InicisApiProvider'
import { GET_WPAY_CARD_LIST } from '@/core/store/api/create/inicisCreate'
import { PlusSvg, IcChipSvg } from '@util/svgUtil'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { paymentDetailInitialState, usePaymentContext } from '@/core/store/api/providers/PaymentApiProvider'

const {
	MY_CHABAP_TAB_FLOW,
	MY_CHABAP_PAYMENT_SCREEN,
	INICIS_PAYMENT_WEBVIEW_SCREEN,
	INICIS_WPAY_SIGN_UP_WEBVIEW_SCREEN,
	INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN,
	INICIS_WPAY_PAYMENT_WEBVIEW_SCREEN,
} = constants

const Container = styled.View`
	flex: 1;
	background-color: #f8f8fa;
`

const ScrollView = styled.ScrollView``

const RadioButtonView = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	padding: ${moderateScale(5)}px;
`

const CarouselView = styled.View`
	flex: 1;
	align-items: center;
`

const Row = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`

const sliderWidth = Dimensions.get('window').width
const itemWidth = Platform.OS === 'ios' ? horizontalScale(sliderWidth - 60) : horizontalScale(sliderWidth - 40)
const itemHeight = itemWidth / 1.7

// let sliderWidth = device.width
// let itemWidth = Math.round(sliderWidth * 1)

const CardView = styled.View`
	height: ${itemHeight}px;
	background-color: #1e4592;
	border-radius: ${moderateScale(8)}px;
	padding: ${moderateScale(22)}px;
	margin: ${moderateScale(5)}px;
`

const EmptyCardView = styled.TouchableOpacity`
	height: ${itemHeight}px;
	background-color: ${theme.colors.disabled};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: grey;
	border-style: dashed;
	padding: ${moderateScale(22)}px;
	margin: ${moderateScale(5)}px;
`

const Precautions = styled.View`
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: ${theme.colors.white};
	padding: ${verticalScale(40)}px 0;
	margin: ${verticalScale(15)}px 0;
`

const AllTermsView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: ${theme.colors.white};
	padding: ${verticalScale(12)}px ${horizontalScale(15)}px;
	margin: ${verticalScale(15)}px 0;
`

const TermsView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: ${verticalScale(5)}px ${horizontalScale(20)}px;
`

const BigImage = styled.Image`
	width: ${moderateScale(18)}px;
	height: ${moderateScale(18)}px;
	tint-color: ${({ tintColor }) => (tintColor ? tintColor : theme.colors.placeholder)};
`

const Image = styled.Image`
	width: ${moderateScale(15)}px;
	height: ${moderateScale(15)}px;
	tint-color: ${({ tintColor }) => (tintColor ? tintColor : theme.colors.placeholder)};
`

const AddCardView = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`

const PaymentButtonView = styled.View`
	padding: 0 ${horizontalScale(24)}px ${verticalScale(40)}px;
`

const PaymentButton = styled.TouchableOpacity`
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

const payMethodList = [
	{ name: '신용 카드', value: 'CARD' },
	{ name: '실시간 계좌 이체', value: 'BANK' },
	{ name: '휴대폰 결제', value: 'MOBILE' },
	{ name: 'PAYCO', value: 'd_payco=Y' },
	{ name: '네이버 페이', value: 'd_npay=Y' },
	{ name: '카카오 페이', value: 'd_kakaopay=Y' },
	{ name: '삼성 페이', value: 'd_samsungpay=Y' },
]

export default function MyChabapPayment() {
	const { navigate } = useNavigation()
	const [currentTab, setCurrentTab] = useState(0)
	const isCarousel = useRef(null)
	const { $alert } = useAlert()
	// query Parameters
	const { params } = useRoute()
	// User Context
	const { dispatch: userDispatch } = useUserContext()
	// Payment Context
	const { state } = usePaymentContext()
	const { data: paymentDetailData } = state.paymentDetail
	const paymentDetail = paymentDetailData?.data || paymentDetailInitialState
	// Inicis Context
	const { state: inicisState, dispatch: inicisDispatch } = useInicisContext()
	const { data: wpayCardListData } = inicisState.wpayCardList
	const wpayCardList = wpayCardListData?.data || []
	// Radio state ('SIMPLE' / 'CHABAP')
	const [payMethodRadio, setPayMethodRadio] = useState('SIMPLE')
	// Select state
	const [isOpen, setIsOpen] = useState(false)
	const [simplePayMethod, setSimplePayMethod] = useState({
		name: '',
		value: '',
	})
	// Wpay Card carouselList
	const [carouselList, setCarouselList] = useState([])
	// Wpay info
	const [wpayInfo, setWpayInfo] = useState({
		paymentId: 0,
		amount: '',
		wpayToken: '',
		payMethod: '',
		bankCardCode: '',
	})
	// Terms state
	const [terms, setTerms] = useState({
		all: false,
		term1: false,
		term2: false,
		term3: false,
		term4: false,
		term5: false,
	})

	useFocusEffect(
		useCallback(() => {
			console.log('params : ', params)

			setSimplePayMethod({
				...simplePayMethod,
				name: payMethodList[0].name,
				value: payMethodList[0].value,
			})
		}, []),
	)

	// wpay 가입여부 확인하고 wpay 카드 목록 api 호출
	useFocusEffect(
		useCallback(() => {
			getUserWpayCheck().then((res) => {
				if (res) getWpayCardList()
			})
		}, []),
	)

	// carousel 카드 리스트 세팅
	useFocusEffect(
		useCallback(() => {
			setCarouselList([...wpayCardList, { wpayToken: '', payMethod: '', bankCardCode: '' }])

			if (wpayCardList.length > 0) {
				const { wpayToken, payMethod, bankCardCode } = wpayCardList[0]
				setWpayInfo({
					paymentId: paymentDetail?.paymentId,
					amount: paymentDetail?.amount,
					wpayToken,
					payMethod,
					bankCardCode,
				})
			}
		}, [wpayCardList]),
	)

	// WPAY 카드 추가 버튼 클릭
	function handlePressAddCard() {
		getUserWpayCheck().then((res) => {
			if (res) {
				navigate(MY_CHABAP_TAB_FLOW, {
					screen: INICIS_WPAY_CARD_REG_WEBVIEW_SCREEN,
					params: {
						returnUrl: MY_CHABAP_PAYMENT_SCREEN,
					},
				})
			} else {
				navigate(MY_CHABAP_TAB_FLOW, {
					screen: INICIS_WPAY_SIGN_UP_WEBVIEW_SCREEN,
					params: {
						returnUrl: MY_CHABAP_PAYMENT_SCREEN,
					},
				})
			}
		})
	}

	// WPAY 가입 여부 확인 API
	async function getUserWpayCheck() {
		try {
			const response = await GET_USER_WPAY_CHECK(userDispatch)
			if (response?.data.success) {
				return response.data.data
			}
		} catch (error) {
			console.log('check user wpay error : ', error)
		}
	}

	// WPAY 결제수단(신용카드) 리스트 API
	async function getWpayCardList() {
		try {
			await GET_WPAY_CARD_LIST(inicisDispatch)
		} catch (error) {
			console.log('get wpayCardList api error : ', error)
		}
	}

	// 약관 동의 체크
	function handleCheckTerms(name, value) {
		if (name === 'all') {
			setTerms({
				...terms,
				all: value,
				term1: value,
				term2: value,
				term3: value,
				term4: value,
				term5: value,
			})
		} else {
			setTerms({
				...terms,
				all: value === false ? false : null,
				[name]: value,
			})
		}
	}

	// 결제 버튼 클릭
	function handlePressPayment() {
		if (termsValidation()) {
			if (payMethodRadio === 'SIMPLE') {
				if (!simplePayMethod.value) {
					$alert('결제방식을 선택하세요.')
					return false
				}
				navigate(MY_CHABAP_TAB_FLOW, {
					screen: INICIS_PAYMENT_WEBVIEW_SCREEN,
					params: {
						paymentId: paymentDetail.paymentId,
						simplePayMethod: simplePayMethod.value,
						amount: paymentDetail.amount,
					},
				})
			}
			if (payMethodRadio === 'CHABAP') {
				if (!wpayInfo.wpayToken || !wpayInfo.payMethod || !wpayInfo.bankCardCode) {
					$alert('차밥페이 카드를 등록하세요.')
					return false
				}
				navigate(MY_CHABAP_TAB_FLOW, {
					screen: INICIS_WPAY_PAYMENT_WEBVIEW_SCREEN,
					params: wpayInfo,
				})
			}
		}
	}

	// 약관 동의 validation
	function termsValidation() {
		if (!terms.term1 || !terms.term2 || !terms.term3 || !terms.term4) {
			$alert('필수 이용약관에 동의해주세요.')
			return false
		}
		return true
	}

	function _renderItem({ item }) {
		return (
			<>
				{!item.wpayToken ? (
					<EmptyCardView style={styles.shadow} onPress={() => handlePressAddCard()}>
						<AddCardView>
							<PlusSvg width={moderateScale(28)} height={moderateScale(28)} />
							<View style={{ margin: moderateScale(5) }} />
							<SmallText>카드 추가 등록</SmallText>
						</AddCardView>
					</EmptyCardView>
				) : (
					<CardView style={styles.shadow}>
						<View style={{ flex: 1 }}>
							<SmallText style={styles.cardText}>{item.cardName}</SmallText>
						</View>
						<View style={{ flex: 1, justifyContent: 'center' }}>
							<IcChipSvg width={moderateScale(50)} height={moderateScale(50)} />
						</View>
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
							<SmallText style={styles.cardText}>{item.bankCardNo}</SmallText>
						</View>
					</CardView>
				)}
			</>
		)
	}

	return (
		<Container>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ padding: moderateScale(24) }}>
					<View style={{ marginBottom: verticalScale(20) }}>
						<SmallText style={styles.boldText}>결제수단</SmallText>
					</View>

					<Row>
						<RadioButtonView onPress={() => setPayMethodRadio('SIMPLE')}>
							<RadioButton.Android
								value={'SIMPLE'}
								status={payMethodRadio === 'SIMPLE' ? 'checked' : 'unchecked'}
								onPress={() => setPayMethodRadio('SIMPLE')}
							/>
							<SmallText style={styles.radioText}>간편결제</SmallText>
						</RadioButtonView>

						{payMethodRadio === 'SIMPLE' ? (
							<Select
								items={payMethodList}
								value={simplePayMethod.name}
								names={['name']}
								onValueChange={(item) => {
									setSimplePayMethod({
										name: item.name,
										value: item.value,
									})
								}}
								placeholder={'차밥 간편결제'}
								isOpen={isOpen}
								setOpen={() => setIsOpen(!isOpen)}
								title={'결제수단 선택'}
								animationType={'fade'}
								rightChangeButton={true}
							/>
						) : null}
					</Row>

					<View style={styles.underLine} />

					<View>
						<Row>
							<RadioButtonView onPress={() => setPayMethodRadio('CHABAP')}>
								<RadioButton.Android
									value={'CHABAP'}
									status={payMethodRadio === 'CHABAP' ? 'checked' : 'unchecked'}
									onPress={() => setPayMethodRadio('CHABAP')}
								/>
								<SmallText style={styles.radioText}>차밥페이 결제</SmallText>
							</RadioButtonView>
						</Row>

						{payMethodRadio === 'CHABAP' ? (
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
									containerCustomStyle={{ marginTop: verticalScale(10) }}
									slideStyle={{ paddingRight: horizontalScale(2), paddingLeft: horizontalScale(2) }}
									activeSlideAlignment="center"
								/>
								<Pagination
									dotsLength={carouselList.length}
									activeDotIndex={currentTab}
									carouselRef={isCarousel}
									dotStyle={{
										width: moderateScale(40),
										height: moderateScale(10),
										borderRadius: moderateScale(5),
										marginHorizontal: 0,
										backgroundColor: '#23c7d0',
									}}
									inactiveDotStyle={{
										width: moderateScale(10),
										height: moderateScale(10),
										borderRadius: moderateScale(5),
										marginHorizontal: 0,
										backgroundColor: '#dbdbdb',
									}}
									inactiveDotOpacity={1}
									inactiveDotScale={0.8}
									tappableDots={true}
								/>
							</CarouselView>
						) : null}
					</View>

					{/* 주의사항 */}
					<View style={styles.underLine} />

					<View style={{ marginTop: verticalScale(15) }}>
						<SmallText style={styles.boldText}>주의사항</SmallText>
					</View>

					<Precautions style={styles.shadow}>
						<SmallText style={styles.precautionsText}>이용 패널티 및 안내 내용</SmallText>
					</Precautions>

					<View style={styles.underLine} />

					{/* 약관동의 */}
					<AllTermsView style={styles.shadow}>
						<SmallText style={styles.boldText}>이용정보 확인 및 모든약관에 동의합니다.</SmallText>
						<Checkbox
							onPress={() => {
								handleCheckTerms('all', !terms.all)
							}}
							checked={terms.all}
							checkStyle={[styles.bigCheckBox, { backgroundColor: theme.colors.turquoise }]}
							uncheckStyle={styles.bigCheckBox}
							customTrueImage={
								<BigImage source={require('@assets/icons/check.png')} tintColor={theme.colors.white} />
							}
							customFalseImage={
								<BigImage source={require('@assets/icons/check.png')} tintColor={theme.colors.white} />
							}
						/>
					</AllTermsView>

					<TermsView>
						<View style={{ flexDirection: 'row' }}>
							<SmallText>충전소 이용 안내동의 (필수) </SmallText>
							<Image source={require('@assets/icons/arrow_next.png')} tintColor={'#797979'} />
						</View>
						<Checkbox
							onPress={() => {
								handleCheckTerms('term1', !terms.term1)
							}}
							checked={terms.term1}
							checkStyle={[styles.checkBox, { backgroundColor: theme.colors.turquoise }]}
							uncheckStyle={styles.checkBox}
							customTrueImage={
								<Image source={require('@assets/icons/check.png')} tintColor={theme.colors.white} />
							}
							customFalseImage={
								<Image source={require('@assets/icons/check.png')} tintColor={theme.colors.white} />
							}
						/>
					</TermsView>

					<TermsView>
						<View style={{ flexDirection: 'row' }}>
							<SmallText>차밥 충전서비스 이용약관 (필수) </SmallText>
							<Image source={require('@assets/icons/arrow_next.png')} tintColor={'#797979'} />
						</View>
						<Checkbox
							onPress={() => {
								handleCheckTerms('term2', !terms.term2)
							}}
							checked={terms.term2}
							checkStyle={[styles.checkBox, { backgroundColor: theme.colors.turquoise }]}
							uncheckStyle={styles.checkBox}
							customTrueImage={
								<Image source={require('@assets/icons/check.png')} tintColor={theme.colors.white} />
							}
							customFalseImage={
								<Image source={require('@assets/icons/check.png')} tintColor={theme.colors.white} />
							}
						/>
					</TermsView>

					<TermsView>
						<View style={{ flexDirection: 'row' }}>
							<SmallText>위치기반 서비스 이용약관 (필수) </SmallText>
							<Image source={require('@assets/icons/arrow_next.png')} tintColor={'#797979'} />
						</View>
						<Checkbox
							onPress={() => {
								handleCheckTerms('term3', !terms.term3)
							}}
							checked={terms.term3}
							checkStyle={[styles.checkBox, { backgroundColor: theme.colors.turquoise }]}
							uncheckStyle={styles.checkBox}
							customTrueImage={
								<Image source={require('@assets/icons/check.png')} tintColor={theme.colors.white} />
							}
							customFalseImage={
								<Image source={require('@assets/icons/check.png')} tintColor={theme.colors.white} />
							}
						/>
					</TermsView>

					<TermsView>
						<View style={{ flexDirection: 'row' }}>
							<SmallText>개인정보 수집 및 이용동의 (필수) </SmallText>
							<Image source={require('@assets/icons/arrow_next.png')} tintColor={'#797979'} />
						</View>
						<Checkbox
							onPress={() => {
								handleCheckTerms('term4', !terms.term4)
							}}
							checked={terms.term4}
							checkStyle={[styles.checkBox, { backgroundColor: theme.colors.turquoise }]}
							uncheckStyle={styles.checkBox}
							customTrueImage={
								<Image source={require('@assets/icons/check.png')} tintColor={theme.colors.white} />
							}
							customFalseImage={
								<Image source={require('@assets/icons/check.png')} tintColor={theme.colors.white} />
							}
						/>
					</TermsView>

					<TermsView>
						<View style={{ flexDirection: 'row' }}>
							<SmallText>개인정보 제3자 제공 동의 (선택) </SmallText>
							<Image source={require('@assets/icons/arrow_next.png')} tintColor={'#797979'} />
						</View>
						<Checkbox
							onPress={() => {
								handleCheckTerms('term5', !terms.term5)
							}}
							checked={terms.term5}
							checkStyle={[styles.checkBox, { backgroundColor: theme.colors.turquoise }]}
							uncheckStyle={styles.checkBox}
							customTrueImage={
								<Image source={require('@assets/icons/check.png')} tintColor={theme.colors.white} />
							}
							customFalseImage={
								<Image source={require('@assets/icons/check.png')} tintColor={theme.colors.white} />
							}
						/>
					</TermsView>
					<View style={{ margin: moderateScale(20) }} />
				</View>
			</ScrollView>

			<PaymentButtonView>
				<PaymentButton
					style={styles.shadow}
					onPress={() => {
						handlePressPayment()
					}}
				>
					<LeftView>
						<SmallText style={styles.buttonText}>총 {paymentDetail.amount}원</SmallText>
					</LeftView>
					<RightView>
						<SmallText style={[styles.buttonText, { color: '#fff' }]}>결제하기</SmallText>
					</RightView>
				</PaymentButton>
			</PaymentButtonView>
		</Container>
	)
}

const styles = StyleSheet.create({
	underLine: {
		borderColor: theme.colors.disabled,
		borderBottomWidth: moderateScale(1),
		marginTop: verticalScale(10),
		marginBottom: verticalScale(10),
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
	bigCheckBox: {
		alignItems: 'center',
		justifyContent: 'center',
		// width: horizontalScale(30),
		// height: verticalScale(30),
		borderRadius: moderateScale(99),
		backgroundColor: theme.colors.disabled,
		padding: moderateScale(5),
	},
	checkBox: {
		alignItems: 'center',
		justifyContent: 'center',
		// width: horizontalScale(25),
		// height: verticalScale(25),
		borderRadius: moderateScale(99),
		backgroundColor: theme.colors.disabled,
		padding: moderateScale(5),
	},
	boldText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
	},
	cardText: {
		fontWeight: '500',
		fontSize: moderateScale(18),
		color: '#fff',
	},
	radioText: {
		fontWeight: '500',
		fontSize: moderateScale(15),
	},
	precautionsText: {
		fontWeight: '500',
		fontSize: moderateScale(15),
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
	},
})
