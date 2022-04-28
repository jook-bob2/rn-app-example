import TextInput from '@/components/ui/input/TextInput'
import Loading from '@/components/ui/Loading'
import Select from '@/components/ui/select/Select'
import SmallText from '@/components/ui/text/SmallText'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import userConst from '@/constants/userConst'
import { GET_EV_MANUFACTURER_LIST, GET_EV_MODEL_LIST } from '@/core/store/api/create/evCreate'
import { POST_ADD_EV } from '@/core/store/api/create/userEvCreate'
import { useEvContext } from '@/core/store/api/providers/EvApiProvider'
import { useUserEvContext } from '@/core/store/api/providers/UserEvApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { carNumberValidator } from '@/utils/validator'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/core'
import { ArrowDownSvg } from '@util/svgUtil'
import React, { useCallback, useEffect, useState } from 'react'
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components'

const { PERSON_SIGN_UP_CAR_ADD_INPUT_SCREEN, CORP_SIGN_UP_CAR_ADD_INPUT_SCREEN, MY_INFO_CAR_MNGT_SCREEN } = constants
const { USER_CORPORATION, USER_PERSONAL, USER_PERSONAL_EV } = userConst
const Container = styled.View`
	height: 100%;
	background-color: ${theme.colors.background};
`
const Wrap = styled.View`
	padding: ${moderateScale(24)}px;
	flex: 1;
	background-color: ${theme.colors.background};
`

const SignInBtnView = styled.View`
	justify-content: flex-end;
	align-items: center;
`
const AccordionWrap = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`

const ConfirmButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 90%;
	height: ${verticalScale(50)}px;
	background-color: ${theme.colors.turquoise};
	border-color: ${theme.colors.white};
	flex-direction: row;
	border-radius: ${moderateScale(8)}px;
	border-width: ${moderateScale(1)}px;
`
const PressableSelect = styled.Pressable`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	//padding-right: ${verticalScale(16)}px;
	//margin-right: 0px;
	//margin-left: 0px;
	height: ${moderateScale(45)}px;
	background-color: ${theme.colors.white};
	border-width: ${moderateScale(1)}px;
	border-color: ${theme.colors.disabled};
	border-radius: ${moderateScale(5)}px;
`

export default function CommonSignUpCarInput({ userType }) {
	const { navigate, goBack } = useNavigation()
	const [useCarBrand, setUseCarBrand] = useState(false)
	const [useCarModel, setUseCarModel] = useState(false)
	const [carBrand, setCarBrand] = useState('')
	const [carModel, setCarModel] = useState('')
	const [useCarNo, setUseCarNo] = useState({ value: '', error: '' })
	const [useCarNickName, setCarNickName] = useState('')
	const { params } = useRoute()
	const [isKeyboardShow, setIsKeyboardShow] = useState(false)
	const { $alert } = useAlert()
	const {
		userState: { id },
	} = useUser()
	const { state, dispatch: addEv } = useUserEvContext()
	const { loading: addEvLoading } = state.addEv
	const { state: evManuListState, dispatch: evManuListDispatch } = useEvContext()
	const { state: evModelListState, dispatch: evModelListDispatch } = useEvContext()
	const { data: evManuListData } = evManuListState.evManufacturerList
	const { data: evModelListData } = evModelListState.evModelList
	const evManuList = evManuListData?.data || []
	const evModelList = evModelListData?.data || []

	useFocusEffect(
		useCallback(() => {
			setCarBrand('')
			setCarModel('')
			setUseCarNo({ value: '', error: '' })
			setCarNickName('')

			getCarBrandList()
		}, []),
	)

	useEffect(() => {
		const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
			setIsKeyboardShow(true)
		})
		const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			setIsKeyboardShow(false)
		})

		return () => {
			showSubscription.remove()
			hideSubscription.remove()
		}
	}, [])

	function handleCarBrandList(value) {
		setUseCarBrand(value)
	}
	const handleCarModelList = (value) => {
		setUseCarModel(value)
	}

	async function getCarBrandList() {
		try {
			const response = await GET_EV_MANUFACTURER_LIST(evManuListDispatch)
			const resData = response.data

			if (resData?.code !== 'SUCCESS') {
				$alert(resData?.msg)
			}
		} catch (error) {
			console.log(error)
		}
	}

	//임시 차량 모델
	async function getCarModelList(manufacturer) {
		try {
			const response = await GET_EV_MODEL_LIST(evModelListDispatch, { manufacturer })
			const resData = response.data

			if (resData?.code !== 'SUCCESS') {
				$alert(resData?.msg)
			}
		} catch (error) {
			console.log(error)
		}
	}

	function carNumValidation() {
		const carNumOldError = carNumberValidator(useCarNo.value)

		if (carNumOldError) {
			setUseCarNo({ ...useCarNo, error: carNumOldError })
			return false
		}

		return true
	}

	async function handelConfirmCarSignUp() {
		console.log(carNumValidation())
		if (carNumValidation() && useCarNickName && carBrand && carModel) {
			try {
				const response = await POST_ADD_EV(addEv, {
					userId: id,
					manufacturer: carBrand,
					model: carModel,
					chargeType: 'AC3',
					carNum: useCarNo.value,
					nickName: useCarNickName,
				})

				const resData = response.data

				if (resData.data) {
					console.log('userType', userType)
					userType === USER_PERSONAL
						? navigate(PERSON_SIGN_UP_CAR_ADD_INPUT_SCREEN)
						: userType === USER_CORPORATION
						? navigate(CORP_SIGN_UP_CAR_ADD_INPUT_SCREEN)
						: params?.userType + '_EV' === USER_PERSONAL_EV
						? setTimeout(() => {
								goBack(MY_INFO_CAR_MNGT_SCREEN)
						  }, 500)
						: setTimeout(() => {
								goBack(MY_INFO_CAR_MNGT_SCREEN)
						  }, 500)
				}
				if (resData?.code !== 'SUCCESS') {
					$alert(resData?.msg)
				}
			} catch (error) {
				console.log('ev add error: ', error)
			}
		}
	}

	function handleSelectCarBrand(brand) {
		setCarBrand(brand)
		setUseCarBrand(false)
		getCarModelList(brand)
		setCarModel('')
	}
	const handleSelectCarModel = (model) => {
		setCarModel(model)
		setUseCarModel(false)
	}

	return (
		<>
			{addEvLoading && <Loading />}
			<Container>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<Wrap>
						<AccordionWrap
							onPress={() => handleCarBrandList(!useCarBrand)}
							style={{ ...styles.inputItem, ...theme.shadow() }}
						>
							<Left>
								{!carBrand ? (
									<SmallText style={styles.inputEv}>제조사</SmallText>
								) : (
									<SmallText style={styles.inputViewEditable}>{carBrand}</SmallText>
								)}
								{/* <AddressInput
								placeholder="제조사"
								editable={false}
								selectTextOnFocus={false}
								value={carBrand}
							/> */}
							</Left>

							<Right style={styles.right}>
								<ArrowDownSvg width={moderateScale(10)} height={moderateScale(6)} />
							</Right>
						</AccordionWrap>

						{!!carBrand && (
							<AccordionWrap
								onPress={() => handleCarModelList(!useCarModel)}
								style={{ ...styles.inputItem, ...theme.shadow() }}
							>
								<Left>
									{!carModel ? (
										<SmallText style={styles.inputEv}>모델</SmallText>
									) : (
										<SmallText style={styles.inputViewEditable}>{carModel}</SmallText>
									)}
									{/* <AddressInput
								placeholder="모델"
								editable={false}
								selectTextOnFocus={false}
								value={carModel}
							/> */}
								</Left>
								<Right style={styles.right}>
									<ArrowDownSvg width={moderateScale(10)} height={moderateScale(6)} />
								</Right>
							</AccordionWrap>
						)}

						<TextInput
							placeholder="차량번호"
							value={useCarNo.value}
							isShadow={false}
							maxLength={8}
							type={'text'}
							errorText={useCarNo.error}
							onChangeText={(text) => setUseCarNo({ value: text, error: '' })}
							setRemoveText={() => setUseCarNo({ value: '', error: '' })}
							style={{
								...theme.shadow(),
								...styles.inputItem,
								marginBottom: useCarNo.error ? verticalScale(33) : verticalScale(10),
							}}
						/>

						<TextInput
							placeholder="차량 닉네임을 입력하세요"
							value={useCarNickName}
							isShadow={false}
							type={'text'}
							style={{ ...theme.shadow(), ...styles.inputItem }}
							onChangeText={(text) => setCarNickName(text)}
							setRemoveText={() => setCarNickName('')}
							maxLength={10}
						/>

						<Text style={styles.addtext}>*등록한 차량 기준 맞춤 충전소를 추천해드립니다.</Text>
					</Wrap>
				</TouchableWithoutFeedback>
				{/* <Footer>
					<FooterView>
						{useCarBrand && (
							<FlatList
								data={evManuList}
								keyExtractor={(item) => item.manufacturer}
								renderItem={({ item }) => (
									<Item
										item={item.manufacturer}
										onPress={() => {
											handleSelectCarBrand(item.manufacturer)
										}}
									/>
								)}
							/>
						)}
					</FooterView>
				</Footer> */}

				{/* <View>
							{useCarModel && carBrand ? (
								<FlatList
									data={evModelList}
									keyExtractor={(item) => item.id}
									renderItem={({ item }) => (
										<Item
											item={item.model}
											onPress={() => {
												handleSelectCarModel(item.model)
											}}
										/>
									)}
								/>
							) : undefined}

						</View> */}
				{useCarBrand ? (
					<PressableSelect>
						<Left>
							<Select
								items={evManuList}
								value={carBrand}
								names={['manufacturer']}
								onValueChange={(item) => {
									handleSelectCarBrand(item.manufacturer)
									//setCode(item.code)
								}}
								setOpen={() => handleCarBrandList(!useCarBrand)}
								isOpen={useCarBrand}
								title={'제조사 선택'}
								selectviewStyle={styles.selectView}
								feedbackStyle={styles.selectFeedback}
								placeholderStyle={styles.selectplaceholder}
							></Select>
						</Left>
					</PressableSelect>
				) : null}

				{useCarModel && carBrand ? (
					<PressableSelect>
						<Left>
							<Select
								items={evModelList}
								value={carModel}
								names={['model']}
								onValueChange={(item) => {
									handleSelectCarModel(item.model)
								}}
								setOpen={() => handleCarModelList(!useCarModel)}
								isOpen={useCarModel}
								title={'모델 선택'}
								selectviewStyle={styles.selectView}
								feedbackStyle={styles.selectFeedback}
								placeholderStyle={styles.selectplaceholder}
							></Select>
						</Left>
					</PressableSelect>
				) : null}

				<SignInBtnView>
					<ConfirmButton
						onPress={() => handelConfirmCarSignUp()}
						style={{
							marginBottom: !isKeyboardShow ? verticalScale(40) : 0,
							backgroundColor:
								useCarNo.value && useCarNickName && carBrand && carModel
									? theme.colors.turquoise
									: theme.colors.disabled,
						}}
					>
						<SmallText style={styles.buttonText}>등록</SmallText>
					</ConfirmButton>
				</SignInBtnView>
			</Container>
		</>
	)
}
const styles = StyleSheet.create({
	right: {
		marginRight: 25,
	},

	inputItem: {
		backgroundColor: theme.colors.white,
		width: '100%',
		height: verticalScale(51),
		borderRadius: moderateScale(5),
		marginBottom: verticalScale(10),
	},
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(5),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(4.65),
		elevation: 2,
		borderRadius: 5,
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
	},
	selectView: {
		borderColor: theme.colors.white,
		backgroundColor: theme.colors.white,
		//borderRadius: moderateScale(5),
		width: moderateScale(110),
		//marginBottom: 8,
		fontSize: moderateScale(14),
	},
	selectplaceholder: {
		color: theme.colors.darkGray,
		fontSize: 14,
	},
	selectFeedback: {
		height: '50%',
	},
	inputViewEditable: {
		paddingLeft: horizontalScale(24),
		fontSize: moderateScale(16),
		paddingTop: verticalScale(8),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	inputEv: {
		backgroundColor: theme.colors.white,
		color: theme.colors.placeholder,
		fontSize: moderateScale(16),
		paddingTop: verticalScale(8),
		paddingLeft: horizontalScale(24),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	addtext: {
		color: theme.colors.turquoise,
		alignSelf: 'flex-start',
		fontSize: moderateScale(13),
	},
})
