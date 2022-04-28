import Button from '@/components/ui/button/Button'
import Modal from '@/components/ui/modal/Modal'
import statusConst from '@/constants/statusConst'
import {
	DELETE_FAVORITE_STATION,
	GET_FAVORITE_STATION,
	GET_FAVORITE_STATION_LIST,
	UPDATE_FAVORITE_STATION,
} from '@/core/store/api/create/userFavoriteStationCreate'
import { useUserFavoriteStationContext } from '@/core/store/api/providers/UserFavoriteStationApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import { useError } from '@/core/store/common/providers/ErrorProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { nicknameValidator } from '@/utils/validator'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { CancelSvg, ExclamationGraySvg, PlusCircleSvg, ThreeDotsSvg, ThunderRedSvg, ThunderSvg } from '@util/svgUtil'
import React, { useCallback, useEffect, useState } from 'react'
import {
	Dimensions,
	FlatList,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	TextInput,
	View,
} from 'react-native'
import styled from 'styled-components'
import Loading from '../ui/Loading'
import PopupMenu from '../ui/popupMenu/PopupMenu'
import SmallText from '../ui/text/SmallText'
import Subtitle from '../ui/text/Subtitle'

const { BOOKMARK_DETAIL_SCREEN, MY_CHABAP_TAB_FLOW, AUTH_STACK_FLOW, SIGN_IN_SCREEN, MY_CHABAP_MAIN_SCREEN } = constants

const Container = styled.View`
	flex: 1;
	width: 100%;
	background-color: ${theme.colors.background};
	padding: ${horizontalScale(24)}px ${verticalScale(24)}px;
`
const BookmarkAddressItem = styled.View`
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white};
	padding: ${moderateScale(16)}px;
	flex-direction: row;
	margin-bottom: ${verticalScale(24)}px;
`

const Description = styled.View`
	flex: 1;
	padding: 0px ${horizontalScale(10)}px;
`
const TextInputEdit = styled.TextInput`
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	border-color: ${theme.colors.disabled};
	padding: ${moderateScale(5)}px;
`

const { CHARGEABLE, WAITING, INSPECTION } = statusConst

const EmptyView = styled.View`
	flex: 1;
`
const EmptyTextView = styled.View`
	flex: 1;
	align-items: center;
	top: ${Platform.OS === 'ios' ? verticalScale(190) : verticalScale(170)}px;
`

const DetailHeader = styled.View`
	flex-direction: row;
	align-items: center;
	border-color: ${theme.colors.disabled};
	padding-left: ${horizontalScale(20)}px;
	padding-top: ${horizontalScale(24)}px;
	/* padding: ${verticalScale(15)}px; */
`

const DetailFooter = styled.View`
	flex-direction: row;
	border-color: ${theme.colors.disabled};
`

const Feedback = styled.View`
	height: 52%;
`

const SignInBtnView = styled.View``
const ConfirmButton = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.turquoise};
	padding: ${verticalScale(20)}px 0;
`
const RemoveView = styled.View`
	position: absolute;
	flex-direction: row;
	align-self: flex-end;
	/* padding: ${moderateScale(13)}px; */
	top: ${verticalScale(18)}px;
	right: ${horizontalScale(18)}px;
`
const ConfirmView = styled.View`
	padding-top: ${moderateScale(20)}px;
	justify-content: center;
	align-items: center;
`

const ConfirmTitleView = styled.View`
	padding-bottom: ${moderateScale(10)}px;
`
const ModifyIcon = styled.Image`
	width: ${moderateScale(48)}px;
	height: ${moderateScale(48)}px;
	margin-right: ${horizontalScale(4)}px;
`
const EditIcons = styled.Image`
	width: ${moderateScale(48)}px;
	height: ${moderateScale(48)}px;
	margin-left: ${horizontalScale(7)}px;
`
const CheckIcons = styled.Image`
	width: ${moderateScale(42)}px;
	height: ${moderateScale(42)}px;
	margin-left: ${horizontalScale(7)}px;
`
const winWidth = Dimensions.get('window').width
const inputWidth = winWidth * 0.63

export default function BookmarkList() {
	const { navigate } = useNavigation()
	const { $confirm } = useConfirm()
	const [opendModal, setOpenModal] = useState(false)
	const { state: list, dispatch: listDispatch } = useUserFavoriteStationContext()
	const { dispatch: infoDispatch } = useUserFavoriteStationContext()
	const { dispatch: deleteDispatch } = useUserFavoriteStationContext()
	const { dispatch: updateDispatch } = useUserFavoriteStationContext()
	// const { loading: updateLoading } = updateState.patchFavoriteStation
	const { loading: favoriteLoading, data: favoriteList } = list.favoriteStationList
	const [textName, setTextName] = useState({ textName: '', inputNameFlag: false })
	const [textAddr, setTextAddr] = useState({ textAddr: '', inputAddrFlag: false })
	const [isKeyboardShow, setIsKeyboardShow] = useState(false)
	const [favorId, setFavorId] = useState('')
	const [favorSation, setFavorSation] = useState('')
	const { $alert } = useAlert()
	const { $error } = useError()
	const [copyNickName, setCopyNickName] = useState('')
	const bookMarkList = favoriteList?.data || []
	const {
		userState: { id: userId },
	} = useUser()
	const {
		params: { useModal, nickName, addrName, favoriteId, stationId },
	} = useRoute()

	useFocusEffect(
		useCallback(() => {
			if (!userId) {
				$confirm({
					msg: () => {
						return (
							<ConfirmView>
								<ConfirmTitleView>
									<Subtitle>로그인이 필요한 서비스입니다.</Subtitle>
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
							navigate(MY_CHABAP_TAB_FLOW, { screen: MY_CHABAP_MAIN_SCREEN })
							// reset({ routes: [{ name: SETTING_MAIN_SCREEN }] })
							console.log('로그인 안함!')
						}
					},
				})
			} else {
				getUserFavoriteList()
			}
		}, [userId]),
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

	useEffect(() => {
		if (useModal) {
			setOpenModal(true)
			setTextName({ textName: nickName })
			setTextAddr({ textAddr: addrName })
			setFavorId(favoriteId)
			setFavorSation(stationId)
		} else {
			setOpenModal(false)
		}
	}, [])

	const [menuOptions] = useState([
		{
			index: 0,
			icon: () => <ModifyIcon source={require('@assets/icons/modify_btn.png')} />,

			text: '수정',
			callback: (favId) => handleModifyChargeStation(favId),
		},
		{
			index: 1,
			icon: () => <ModifyIcon source={require('@assets/icons/delete_btn.png')} />,

			text: '삭제',
			callback: (favId) => handleConfirmDeleteBookMark(favId),
		},
	])

	// 즐겨찾기 목록
	function getUserFavoriteList() {
		setTimeout(async () => {
			try {
				const response = await GET_FAVORITE_STATION_LIST(listDispatch, { userId })
				const resData = response.data
				//console.log('resdata', resData)
				if (resData?.code !== 'SUCCESS') {
					$alert(resData?.msg)
				}
			} catch (e) {
				console.log(e)
				const errData = e?.data
				if (errData?.code) {
					const { code, msg } = errData
					setTimeout(() => {
						$error({
							code,
							msg,
							onPress: (result) => {
								if (result) {
									getUserFavoriteList()
								}
							},
						})
					}, 1000)
				}
			}
		}, 500)
	}

	function handelAddCarChargeStation() {
		navigate(BOOKMARK_DETAIL_SCREEN, { isModify: true })
	}

	async function handleModifyChargeStation(id) {
		setFavorId(id)

		try {
			const response = await GET_FAVORITE_STATION(infoDispatch, { id, userId })
			const resData = response.data

			if (resData.code === 'SUCCESS') {
				setCopyNickName(resData?.data.nickName)
				setTextName({ ...textName, textName: resData?.data.nickName })
				setTextAddr({ ...textAddr, textAddr: resData?.data.addr1 + resData.data.addr2 })
				setFavorSation(resData?.data.stationId)
			}

			if (resData?.code !== 'SUCCESS') {
				$alert(resData?.msg)
			}
		} catch (e) {
			console.log(e)
		}
		setOpenModal(true)
	}

	function handleConfirmDeleteBookMark(id) {
		$confirm({
			msg: '이 주소를 삭제 하시겠습니까?',
			cancelButtonName: '아니오',
			confirmButtonName: '예',
			onPress: (result) => {
				if (result) {
					handleDeleteBookMark(id)
				}
			},
		})
	}

	async function handleDeleteBookMark(id) {
		try {
			const response = await DELETE_FAVORITE_STATION(deleteDispatch, { id, userId })
			const resData = response.data

			if (resData.data) {
				getUserFavoriteList()
			} else {
				$alert('삭제 실패')
			}

			if (resData?.code !== 'SUCCESS') {
				$alert(resData?.msg)
			}

			return
		} catch (error) {
			console.log('delete error: ', error)
		}
	}

	function handleCancle() {
		setOpenModal(false)
		setTextName({ textName: '', inputNameFlag: false })
		setTextAddr({ textAddr: '', inputAddrFlag: false })
	}

	function handleAddressModify() {
		navigate(BOOKMARK_DETAIL_SCREEN, {
			isModify: false,
			nickName: textName.textName,
			favoriteId: favorId,
		})
		setTextAddr({ inputAddrFlag: true, textAddr: textAddr.textAddr })
		setOpenModal(false)
	}

	//변경완료시
	async function handleChangeBookMarkInfo() {
		if (toastHandler()) {
			try {
				const response = await UPDATE_FAVORITE_STATION(updateDispatch, {
					id: favorId,
					stationId: favorSation,
					nickName: textName.textName,
				})
				const resData = response.data
				if (resData.data) {
					setOpenModal(false)
					getUserFavoriteList()
				} else {
					$alert('수정 실패')
				}
				if (resData?.code !== 'SUCCESS') {
					$alert(resData?.msg)
				}
			} catch (error) {
				console.log('update error: ', error)
			}
		}
	}

	function setRemoveText() {
		setTextName({ textName: '', inputNameFlag: true })
	}
	//Toast 핸들러
	function toastHandler() {
		const nickNameError = nicknameValidator(textName.textName)
		if (nickNameError) {
			$alert(nickNameError)
			return false
		}
		return true
	}

	return (
		<>
			<Container>
				{favoriteLoading && <Loading />}
				{bookMarkList.length > 0 ? (
					<FlatList
						data={bookMarkList}
						keyExtractor={(item) => item.favoriteId}
						renderItem={({ item, index }) => (
							<BookmarkAddressItem style={styles.contents}>
								{item.status === CHARGEABLE ? (
									<ThunderSvg
										style={{ ...theme.shadow(), ...styles.icon }}
										width={moderateScale(32)}
										height={moderateScale(32)}
									/>
								) : item.status === WAITING ? (
									<ThunderRedSvg
										style={{ ...theme.shadow(), ...styles.icon }}
										width={moderateScale(32)}
										height={moderateScale(32)}
									/>
								) : item.status === INSPECTION ? (
									<ExclamationGraySvg width={moderateScale(32)} height={moderateScale(32)} />
								) : null}
								<Description>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
										}}
									>
										<SmallText style={styles.boldText}>{item.nickName}</SmallText>
									</View>

									<SmallText
										style={{
											...styles.boldTextName,
										}}
									>
										{item.name}
									</SmallText>
									<View style={{ margin: moderateScale(5) }} />
									<View>
										<SmallText style={{ color: theme.colors.darkGray }}>
											{item.addr1} {item.addr2}
										</SmallText>
									</View>
									<View style={{ margin: moderateScale(2) }} />
								</Description>
								<PopupMenu
									icon={<ThreeDotsSvg width={moderateScale(20)} height={moderateScale(15)} />}
									menuOptions={menuOptions}
									item={bookMarkList[index].favoriteId}
								/>
							</BookmarkAddressItem>
						)}
					/>
				) : (
					<EmptyView>
						<EmptyTextView>
							<ExclamationGraySvg width={moderateScale(35)} height={moderateScale(35)} />
							<SmallText style={styles.emptyText}>등록된 즐겨찾는 충전소가 없어요.</SmallText>
						</EmptyTextView>
					</EmptyView>
				)}

				{opendModal ? (
					<Modal.Common
						transparent={true}
						visible={opendModal}
						animationType="fade"
						setClose={() => setOpenModal(false)}
					>
						<Feedback />
						<KeyboardAvoidingView
							style={{ flex: 1, zIndex: 2, justifyContent: 'flex-end' }}
							behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
						>
							<View
								style={{
									flex: 1,
									zIndex: 1,
									justifyContent: 'flex-end',
									top: isKeyboardShow && Platform.OS === 'android' ? verticalScale(86) : 0,
								}}
							>
								<View
									style={{
										height: !isKeyboardShow ? '70%' : verticalScale(260),
										backgroundColor: theme.colors.white,
										borderTopStartRadius: moderateScale(25),
										borderTopEndRadius: moderateScale(25),
										padding: moderateScale(15),
									}}
								>
									<View>
										<DetailHeader>
											{/*Header Text*/}
											<View style={{ alignItems: 'center', justifyContent: 'center' }}>
												<SmallText style={styles.modalBoldHeaderText}>즐겨찾기 수정</SmallText>
											</View>
										</DetailHeader>
									</View>
									<View style={{ flex: 3 }}>
										<View
											style={{
												alignItems: 'center',
												flexDirection: 'row',
												flex: 2,
												padding: moderateScale(20),
											}}
										>
											<SmallText style={styles.modalBoldContentText}>명칭</SmallText>
											{!textName.inputNameFlag ? (
												<>
													<Pressable
														style={styles.showText}
														onPress={() =>
															setTextName({
																inputNameFlag: true,
																textName: textName.textName,
															})
														}
													>
														<SmallText
															style={{
																color: theme.colors.text,
																fontSize: moderateScale(16),
															}}
														>
															{textName.textName}
														</SmallText>
													</Pressable>
													<Pressable
														onPress={() =>
															setTextName({
																inputNameFlag: true,
																textName: textName.textName,
															})
														}
													>
														<EditIcons source={require('@assets/icons/edit.png')} />
													</Pressable>
													{/* <Edit
														style={styles.checkIcon}
														width={moderateScale(60)}
														height={moderateScale(60)}
														onPress={() =>
															setTextName({
																inputNameFlag: true,
																textName: textName.textName,
															})
														}
													/> */}
												</>
											) : (
												<>
													<View
														style={{
															height: verticalScale(50),
															left: horizontalScale(10),
														}}
													>
														<TextInput
															style={styles.modifyTextInput}
															value={textName.textName}
															maxLength={10}
															onChangeText={(text) =>
																setTextName({ ...textName, textName: text })
															}
														/>

														<RemoveView>
															<Pressable onPress={() => setRemoveText()}>
																<CancelSvg
																	width={moderateScale(14)}
																	height={moderateScale(14)}
																	fill={theme.colors.text}
																/>
															</Pressable>
														</RemoveView>
													</View>
													<Pressable
														onPress={() => {
															let name = ''
															if (copyNickName === textName.textName) {
																name = copyNickName
															} else if (textName.textName === '') {
																name = copyNickName
															} else if (textName.textName) {
																name = textName.textName
															}
															setTextName({
																inputNameFlag: false,
																textName: name,
															})
														}}
													>
														<CheckIcons
															source={require('@assets/icons/circle_check.png')}
														/>
													</Pressable>
													{/* <CircleCheck
														style={styles.checkIcon}
														width={moderateScale(60)}
														height={moderateScale(60)}
														onPress={() => {
															let name = ''
															if (copyNickName === textName.textName) {
																name = copyNickName
															} else if (textName.textName === '') {
																name = copyNickName
															} else if (textName.textName) {
																name = textName.textName
															}
															setTextName({
																inputNameFlag: false,
																textName: name,
															})
														}}
													/> */}
												</>
											)}
										</View>
										<View
											style={{
												alignItems: 'center',
												flexDirection: 'row',
												flex: 1,
												padding: moderateScale(20),
											}}
										>
											<SmallText style={styles.modalBoldContentTextAddr}>주소</SmallText>
											{!textAddr.inputAddrFlag ? (
												<>
													<View
														style={{
															flex: 5,
															height: 50,
														}}
													>
														<Pressable
															style={styles.showText}
															onPress={() => handleAddressModify()}
														>
															<SmallText
																style={{
																	color: theme.colors.text,
																	fontSize: moderateScale(16),
																}}
															>
																{textAddr.textAddr}
															</SmallText>
														</Pressable>
													</View>
													<Pressable onPress={() => handleAddressModify()}>
														<EditIcons source={require('@assets/icons/edit.png')} />
													</Pressable>
													{/* <Edit
														style={styles.checkIcon}
														width={moderateScale(60)}
														height={moderateScale(60)}
														onPress={() => handleAddressModify()}
													/> */}
												</>
											) : (
												<>
													<TextInputEdit style={styles.modifyTextInput} />
													<Pressable onPress={() => setTextAddr({ inputAddrFlag: false })}>
														<EditIcons source={require('@assets/icons/circle_check.png')} />
													</Pressable>
													{/* <CircleCheck
														style={styles.checkIcon}
														width={moderateScale(60)}
														height={moderateScale(60)}
														onPress={() => setTextAddr({ inputAddrFlag: false })}
													/> */}
												</>
											)}
										</View>
									</View>
								</View>
								<DetailFooter>
									<Button style={{ ...styles.cancleBtn }} onPress={() => handleCancle()}>
										취소
									</Button>

									<Button style={{ ...styles.modifyBtn }} onPress={() => handleChangeBookMarkInfo()}>
										변경 완료
									</Button>
								</DetailFooter>
							</View>
						</KeyboardAvoidingView>
					</Modal.Common>
				) : undefined}
			</Container>
			<SignInBtnView>
				<ConfirmButton onPress={() => handelAddCarChargeStation()} style={styles.registerBtn}>
					<PlusCircleSvg width={moderateScale(18)} height={moderateScale(18)} />
					<View style={{ marginRight: horizontalScale(5) }} />
					<SmallText style={styles.buttonText}>즐겨찾기 추가</SmallText>
				</ConfirmButton>
			</SignInBtnView>
		</>
	)
}

const styles = StyleSheet.create({
	registerBtn: {
		backgroundColor: theme.colors.turquoise,
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
		marginLeft: horizontalScale(8),
	},

	deleteButton: {
		borderRadius: 23,
		backgroundColor: theme.colors.turquoise,
		borderColor: theme.colors.disabled,
		height: verticalScale(30),
		width: horizontalScale(20),
		marginLeft: horizontalScale(50),
	},
	iconStyle: {
		flex: 0.5,
		marginLeft: horizontalScale(10),
	},
	textStyle: {
		flext: 1,
	},
	btnView: {
		flex: 1,
	},
	textHead: {
		textAlign: 'left',
		textAlignVertical: 'center',
		fontSize: 13,
	},
	textSub: {
		textAlign: 'left',
		textAlignVertical: 'center',
		fontSize: 13,
	},
	boldText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		fontSize: moderateScale(16),
		color: theme.colors.turquoise,
	},
	boldTextName: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		fontSize: moderateScale(16),
		color: theme.colors.text,
	},
	modalBoldHeaderText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		fontSize: moderateScale(20),
		color: theme.colors.text,
	},

	cancleBtn: {
		backgroundColor: theme.colors.darkGray,
		flex: 1,
		borderRadius: moderateScale(1),
		height: Platform.OS === 'ios' ? verticalScale(80) : verticalScale(50),
	},
	contents: {
		elevation: 1,
		borderColor: theme.colors.white,
	},
	modifyBtn: {
		flex: 1,
		borderRadius: moderateScale(1),
		height: Platform.OS === 'ios' ? verticalScale(80) : verticalScale(50),
	},
	modalBoldContentText: {
		fontSize: moderateScale(16),
		flex: 1,
	},

	modalBoldContentTextAddr: {
		fontSize: moderateScale(16),
		flex: 1,
		alignSelf: 'flex-start',
	},
	showText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		marginLeft: horizontalScale(30),
		color: theme.colors.darkGray,
		alignContent: 'center',
		flex: 4,
	},

	modifyTextInput: {
		// marginLeft: horizontalScale(30),
		width: Platform.OS === 'ios' ? horizontalScale(190) : inputWidth,
		height: verticalScale(50),
		borderWidth: horizontalScale(1),
		borderRadius: moderateScale(8),
		borderColor: theme.colors.disabled,
		padding: moderateScale(5),
		color: theme.colors.darkGray,
		paddingLeft: horizontalScale(10),
	},
	emptyText: {
		marginTop: verticalScale(18),
		fontSize: moderateScale(16),
		color: theme.colors.darkGray,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	icon: {
		...Platform.select({
			android: {
				borderRadius: moderateScale(16),
			},
		}),
	},
	checkIcon: {
		marginLeft: horizontalScale(5),
		...theme.shadow(),
		...Platform.select({
			android: {
				borderRadius: moderateScale(30),
			},
		}),
	},
})
