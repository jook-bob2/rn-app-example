import AddressItem from '@/components/ui/AddressItem'
import Loading from '@/components/ui/Loading'
import { GET_ADDRESS } from '@/core/store/api/create/addressCreate'
import { useAddressContext } from '@/core/store/api/providers/AddressApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useBackColor } from '@/core/store/common/providers/BackColorProvider'
import { useError } from '@/core/store/common/providers/ErrorProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { useNavigation, useRoute } from '@react-navigation/native'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import { CancelSvg, MapMarkerSvg, SearchSvg } from '@util/svgUtil'
import React, { useEffect, useRef, useState } from 'react'
import {
	FlatList,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import styled from 'styled-components'
const { PERSON_SIGN_UP_ADDR_SCREEN, CORP_SIGN_UP_CORP_INPUT_SCREEN, MY_INFO_MODIFY_SCREEN } = constants
const Container = styled.View`
	width: 100%;
	height: 85%;
	padding-left: ${moderateScale(24)}px;
	padding-right: ${moderateScale(24)}px;
	padding-top: ${moderateScale(14)}px;
	background-color: ${theme.colors.background};
`
const EmptyContainer = styled.View`
	width: 100%;
	height: 100%;
	padding-left: ${moderateScale(24)}px;
	padding-right: ${moderateScale(24)}px;
	padding-top: ${moderateScale(14)}px;
	background-color: ${theme.colors.background};
`
const SearchView = styled.View`
	flex: 1;
	justify-content: center;
	/* background-color: ${theme.colors.danger}; */
	padding: 0px ${horizontalScale(24)}px;
	border-top-left-radius: ${moderateScale(16)}px;
	border-top-right-radius: ${moderateScale(16)}px;
`

const Input = styled.TextInput`
	padding-right: ${horizontalScale(24)}px;
	padding-left: ${horizontalScale(15)}px;
	margin-right: ${horizontalScale(30)}px;
	margin-left: ${horizontalScale(5)}px;
	padding-top: ${verticalScale(16)}px;
	color: ${theme.colors.text};
	background-color: ${theme.colors.white};
	/* height: ${verticalScale(40)}px; */
`

const SearchViewInput = styled.View`
	position: absolute;
	align-self: flex-end;
	margin-top: ${verticalScale(5)}px;
	right: ${verticalScale(2)}px;
	padding: ${moderateScale(9)}px;
	background-color: ${theme.colors.white};
`
const RemoveView = styled.View`
	position: absolute;
	align-self: flex-end;
	padding: 0 ${moderateScale(55)}px;
`

export default function CommonAddressInput() {
	const LIMIT = 20
	const { state: addressState, dispatch: addressDispatch } = useAddressContext()
	const { loading: addressLoading } = addressState.userAddress
	const [useAddress, setUseAddress] = useState('')
	const { navigate, reset } = useNavigation()
	const { params } = useRoute()
	const [addressList, setAddressList] = useState([])
	const [page, setPage] = useState(1)
	const enterRef = useRef()
	const { $error } = useError()
	const { $alert } = useAlert()
	const { setBottomColor } = useBackColor()

	useEffect(() => {
		if (addressList?.length > 0) {
			setTimeout(() => {
				setBottomColor(theme.colors.white)
			}, 0)
		} else {
			setTimeout(() => {
				setBottomColor(theme.colors.background)
			}, 0)
		}
	}, [addressList])

	function handleSelectAddress(address1, zipNum) {
		//개인 회원가입일때
		if (params?.personalInfo) {
			const personalReqData = {
				email: params.personalInfo.email,
				name: params.personalInfo.name,
				passwd: params.personalInfo.passwd,
				birthdate: params.personalInfo.birthdate,
				userTypeCd: params.personalInfo.userTypeCd,
				gender: params.personalInfo.gender,
				mobileno: params.personalInfo.mobileno,
				verifyFlag: params.personalInfo.verifyFlag,
				alarmFlag: params.personalInfo.alarmFlag,
				hpCoCd: params.personalInfo.hpCoCd,
				frnrFlag: params.personalInfo.frnrFlag,
				signUpAddrRequest: {
					addr1: address1,
					addr2: '',
					zipcode: zipNum,
				},
			}

			navigate(PERSON_SIGN_UP_ADDR_SCREEN, { personalInfos: personalReqData })
			//법인 회원가입일때
		} else if (params?.companyInfo) {
			const companyReqData = {
				...params?.companyInfo,
				// userInfo: params.companyInfo.userInfo,
				// companyName: params.companyInfo.companyName,
				// bizRegNum: params.companyInfo.bizRegNum,
				// companyRepresentative: params.companyInfo.companyRepresentative,
				// bizType: params.companyInfo.bizType,
				// bizItem: params.companyInfo.bizItem,
				// phone: params.companyInfo.phone,
				addr1: address1,
				// addr2: params.companyInfo.addr2,
				// alarmFlag: params.companyInfo.alarmFlag,
				// hpCoCd: params.companyInfo.hpCoCd,
				// frnrFlag: params.companyInfo.frnrFlag,
				// fileName: params.companyInfo.fileName,
				// fileUri: params.companyInfo.fileUri,
			}
			navigate(CORP_SIGN_UP_CORP_INPUT_SCREEN, { companyInfos: companyReqData })
			// 회원 수정일때
		} else if (params?.personalData) {
			const personalData = {
				name: params.personalData.name,
				hp: params.personalData.hp,
				email: params.personalData.email,
				addr1: address1,
				addr2: params.personalData.addr2,
				userTypeCd: params.personalData.userTypeCd,
				zipCode: zipNum,
			}

			reset({
				routes: [
					{
						name: MY_INFO_MODIFY_SCREEN,
						params: { personalData: personalData },
					},
				],
			})
			// navigate(MY_CHABAP_TAB_FLOW, { screen: MY_INFO_MODIFY_SCREEN, params: personalData })
			// goBack(MY_INFO_MODIFY_SCREEN)
			//navigate(MY_INFO_MODIFY_SCREEN, { addr1: address1, addr2: params.personalData.addr2 })
		}
	}

	async function handleSearchAddress(searchPage) {
		Keyboard.dismiss()
		if (useAddress) {
			try {
				const response = await GET_ADDRESS(addressDispatch, {
					keyword: useAddress,
					currentPage: searchPage,
					countPerPage: LIMIT,
				})
				//object 데이터 뽑아 사용할때
				const resData = response.data

				if (resData.data.results.juso === null) {
					$alert(resData.data.results.common.errorMessage)
				}
				if (resData?.code === 'SUCCESS') {
					const jusoList = resData.data.results.juso

					// const newList = jusoList.map((item) => {
					// 	return {
					// 		roadAddrPart1: item.roadAddrPart1,
					// 		roadAddrPart2: item.roadAddrPart2,
					// 		zipNo: item.zipNo,
					// 	}
					// })

					setAddressList(jusoList)
					setPage(searchPage + 1)
				}
				if (resData.data.results.juso.length <= 0) {
					$alert('검색결과가 없습니다.\n 도로명, 지번, 건물명 아파트명으로 \n다시 검색해주세요')
				}
			} catch (error) {
				console.log('search error => ', error)
				const errData = error?.data
				if (errData?.code) {
					const { code, msg } = errData
					setTimeout(() => {
						$error({
							code,
							msg,
							onPress: (result) => {
								if (result) {
									handleSearchAddress(0)
								}
							},
						})
					}, 1000)
				}
			}
		} else {
			setAddressList([])
			setPage(0)
		}
	}

	async function handleSearchAddressEndRoll() {
		Keyboard.dismiss()
		try {
			const response = await GET_ADDRESS(addressDispatch, {
				keyword: useAddress,
				currentPage: page,
				countPerPage: LIMIT,
			})
			//object 데이터 뽑아 사용할때
			const resData = response.data

			if (resData?.code === 'SUCCESS') {
				const jusoList = resData.data.results.juso

				const newList = jusoList.map((item) => {
					return {
						roadAddrPart1: item.roadAddrPart1,
						roadAddrPart2: item.roadAddrPart2,
						zipNo: item.zipNo,
					}
				})

				setAddressList(addressList.concat(newList))
				setPage(page + 1)
			}
		} catch (error) {
			console.log('search error => ', error)
		}
	}

	function endRollData() {
		handleSearchAddressEndRoll(page)
	}

	return (
		<>
			{addressLoading && <Loading />}
			{addressList?.length > 0 ? (
				<>
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
						keyboardVerticalOffset={
							Platform.OS === 'ios'
								? verticalScale(verticalScale(getStatusBarHeight()) + verticalScale(70))
								: verticalScale(verticalScale(getStatusBarHeight()) + verticalScale(72))
						}
					>
						<TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
							<Container>
								<FlatList
									data={addressList}
									renderItem={({ item }) => (
										<AddressItem
											headText={item.roadAddrPart1}
											subText={item.roadAddrPart2}
											headTextStyle={styles.headText}
											subTextStyle={styles.subText}
											onPress={() => {
												handleSelectAddress(item.roadAddrPart1, item.zipNo)
											}}
											icon={<MapMarkerSvg width={moderateScale(11)} height={moderateScale(11)} />}
										/>
									)}
									onEndReached={endRollData}
									onEndReachedThreshold={0.6}
									onScrollEndDrag={Keyboard.dismiss}
								/>
							</Container>
						</TouchableWithoutFeedback>
						<SearchView
							style={{
								...styles.shadow,
							}}
						>
							<View style={{ ...styles.searchInputStyle, ...theme.shadow() }}>
								<Input
									style={{
										width: Platform.OS === 'ios' ? horizontalScale(240) : horizontalScale(320),
									}}
									placeholder="지번, 도로명, 건물명으로 검색"
									autoFocus={true}
									value={useAddress}
									onChangeText={(text) => setUseAddress(text)}
									returnKeyType="done"
									onSubmitEditing={() => handleSearchAddress(0)}
									childRef={enterRef}
									blurOnSubmit={false}
								/>
								{useAddress ? (
									<RemoveView>
										<TouchableOpacity
											style={{
												marginTop: verticalScale(15),
											}}
											onPress={() => setUseAddress('')}
										>
											<CancelSvg width={moderateScale(20)} height={moderateScale(20)} />
										</TouchableOpacity>
									</RemoveView>
								) : null}

								<SearchViewInput>
									<TouchableOpacity onPress={() => handleSearchAddress(0)}>
										<SearchSvg width={moderateScale(20)} height={moderateScale(20)} />
									</TouchableOpacity>
								</SearchViewInput>
							</View>
						</SearchView>
					</KeyboardAvoidingView>
				</>
			) : (
				<EmptyContainer>
					<View style={{ ...styles.searchInputEmptyListStyle, ...theme.shadow() }}>
						<Input
							placeholder="지번, 도로명, 건물명으로 검색"
							style={{
								width: Platform.OS === 'ios' ? horizontalScale(240) : horizontalScale(300),
							}}
							autoFocus={true}
							value={useAddress}
							onChangeText={(text) => setUseAddress(text)}
							onSubmitEditing={() => handleSearchAddress(0)}
							childRef={enterRef}
							blurOnSubmit={false}
						/>
						{useAddress ? (
							<RemoveView>
								<TouchableOpacity
									style={{
										marginTop: verticalScale(15),
									}}
									onPress={() => setUseAddress('')}
								>
									<CancelSvg width={moderateScale(20)} height={moderateScale(20)} />
								</TouchableOpacity>
							</RemoveView>
						) : null}
						<SearchViewInput>
							<TouchableOpacity onPress={() => handleSearchAddress(0)}>
								<SearchSvg width={moderateScale(20)} height={moderateScale(20)} />
							</TouchableOpacity>
						</SearchViewInput>
					</View>
				</EmptyContainer>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	headText: {
		fontSize: moderateScale(14),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		marginLeft: horizontalScale(10),
		marginTop: verticalScale(3),
	},
	subText: {
		fontSize: moderateScale(12),
		marginTop: verticalScale(8),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		marginLeft: horizontalScale(10),
	},
	iconStyle: { tintColor: theme.colors.turquoise },

	searchInputStyle: {
		borderRadius: moderateScale(5),
		marginTop: verticalScale(5),
		height: verticalScale(50),
		backgroundColor: theme.colors.white,
	},
	searchInputEmptyListStyle: {
		borderRadius: moderateScale(5),
		marginTop: verticalScale(16),
		height: verticalScale(50),
		backgroundColor: theme.colors.white,
	},
	shadow: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: {
					width: 0,
					height: verticalScale(-3),
				},
				shadowOpacity: 0.03,
				shadowRadius: moderateScale(4.65),
			},
			android: { elevation: -10 },
		}),
	},
})
