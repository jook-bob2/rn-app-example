import React, { useState, useCallback } from 'react'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import SmallText from '../ui/text/SmallText'
import TextInput from '@/components/ui/input/TextInput'
import Modal from '@/components/ui/modal/Modal'
import Row from '@/components/ui/view/Row'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import { useUserEvContext } from '@/core/store/api/providers/UserEvApiProvider'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import {
	GET_SHARED_USER_LIST,
	GET_RECEIVED_SHARE_LIST,
	POST_SEND_SHARE,
	PATCH_STOP_SHARE,
	PATCH_RELEASE_SHARE,
	PATCH_REFUSE_SHARE,
	GET_MY_EV_LIST,
	GET_SHARED_EV_LIST,
} from '@/core/store/api/create/userEvCreate'
import { ThreeDotsSvg, ExclamationGraySvg } from '@util/svgUtil'
import Loading from '@component/ui/Loading'
import { useUser } from '@/core/store/common/providers/UserProvider'
import userConst from '@/constants/userConst'
import constants from '@/navigations/constants'
import shareConst from '@/constants/shareConst'
import { PhoneNumberValidator, sharePasswdValidator } from '@/utils/validator'
import moment from 'moment'

const { MY_CHABAP_TAB_FLOW, MY_CHABAP_FAMILY_TERMS_SCREEN, MY_INFO_CAR_MNGT_SCREEN } = constants
const { SHARE_TYPE_SHARED } = shareConst
const { USER_CORPORATION, USER_PERSONAL } = userConst

const Container = styled.View`
	flex: 1;
	background-color: #f8f8fa;
	padding: ${moderateScale(20)}px;
`

const TabContents = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(0)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white};
	margin-bottom: ${verticalScale(15)}px;
`

const MyCarTab = styled.TouchableOpacity`
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: ${({ searchType }) => (searchType === 'my' ? theme.colors.turquoise : theme.colors.white)};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${({ searchType }) => (searchType === 'my' ? theme.colors.turquoise : theme.colors.white)};
	padding: ${moderateScale(18)}px;
`

const SharedCarTab = styled.TouchableOpacity`
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: ${({ searchType }) => (searchType === 'shared' ? theme.colors.turquoise : theme.colors.white)};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${({ searchType }) => (searchType === 'shared' ? theme.colors.turquoise : theme.colors.white)};
	padding: ${moderateScale(18)}px;
`

const ScrollView = styled.ScrollView``

const Contents = styled.View`
	flex: 1;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white};
	padding: ${moderateScale(15)}px;
	margin-bottom: ${verticalScale(15)}px;
`

const LabelView = styled.View`
	align-items: center;
	justify-content: center;
	margin-left: ${horizontalScale(5)}px;
`

const EemptyView = styled.View`
	flex: 0.9;
	align-items: center;
	justify-content: center;
`

const DetailHeader = styled.View`
	flex-direction: row;
	align-items: center;
	border-bottom-width: ${verticalScale(1)}px;
	border-color: ${theme.colors.disabled};
	padding: ${verticalScale(12)}px ${horizontalScale(12)}px ${verticalScale(20)}px;
`

const DetailContents = styled.View`
	border-bottom-width: ${verticalScale(1)}px;
	border-color: ${theme.colors.disabled};
	padding: ${moderateScale(12)}px;
`

const UsingLabel = styled.View`
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1.5)}px;
	border-radius: ${moderateScale(18)}px;
	border-color: ${theme.colors.turquoise};
	margin-left: ${horizontalScale(10)}px;
	padding: ${verticalScale(2.5)}px ${horizontalScale(10)}px;
`

const AddCarButtonView = styled.View`
	padding: 0 ${horizontalScale(24)}px ${verticalScale(40)}px;
`

const AddCarButton = styled.TouchableOpacity`
	align-items: center;
	background-color: ${theme.colors.turquoise};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(12)}px;
	border-color: ${theme.colors.turquoise};
	padding: ${moderateScale(20)}px;
`

const StopButton = styled.TouchableOpacity`
	align-items: center;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(18)}px;
	border-color: ${theme.colors.white};
	padding: ${verticalScale(10)}px ${horizontalScale(15)}px;
`

const ShareButton = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.turquoise};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(12)}px;
	border-color: ${theme.colors.turquoise};
	padding: ${moderateScale(20)}px;
`

const Image = styled.Image`
	width: ${moderateScale(25)}px;
	height: ${moderateScale(25)}px;
`

const CautionView = styled.View`
	align-items: center;
	justify-content: center;
	padding: ${verticalScale(15)}px 0;
	margin: ${verticalScale(20)}px 0 ${verticalScale(10)}px;
`

const TextInputView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: ${verticalScale(10)}px 0 ${verticalScale(10)}px ${horizontalScale(5)}px;
`

const ShareUserInfoView = styled.View`
	border-top-width: ${moderateScale(1)}px;
	border-color: ${theme.colors.disabled};
	padding-top: ${verticalScale(15)}px;
	margin-top: ${verticalScale(15)}px;
`

const ModalContainer = styled.View`
	flex: 1;
	z-index: 1;
	justify-content: flex-end;
`

const CloseButtonView = styled.TouchableOpacity`
	flex: 0.2;
`

const ModalWrap = styled.View`
	flex: 0.8;
	background-color: white;
	border-top-start-radius: ${moderateScale(25)}px;
	border-top-end-radius: ${moderateScale(25)}px;
	padding: ${verticalScale(20)}px ${horizontalScale(24)}px ${verticalScale(40)}px;
`

export default function MyChabapCarManagement() {
	const { navigate } = useNavigation()
	const { $alert } = useAlert()
	const {
		userState: { id, userTypeCd },
	} = useUser()
	const { state, dispatch } = useUserEvContext()

	// 본인 차량 리스트
	const { data: myEvListData, loading: myEvListLoading } = state.myEvList
	const myEvList = myEvListData?.data || []
	// 공유받은 차량 리스트
	const { data: sharedEvListData, loading: sharedEvListLoading } = state.sharedEvList
	const sharedEvList = sharedEvListData?.data || []
	// 공유된 유저 리스트
	const { data: sharedUserListData } = state.sharedUserList
	const sharedUserList = sharedUserListData?.data || []
	// 공유받은 큐 리스트
	const { data: receivedShareListData } = state.receivedShareList
	const receivedShareList = receivedShareListData?.data || []
	// const [receivedShareList, setReceivedShareList] = useState([])

	// 공유 보내기
	const { loading: sendShareLoading } = state.sendShare
	// 공유 중단하기
	// const { loading: stopShareLoading } = state.stopShare
	// 공유 해제하기
	// const { loading: releaseShareLoading } = state.releaseShare
	// 공유 거절하기
	const { loading: refuseShareLoading } = state.refuseShare
	// tab state
	const [searchType, setSearchType] = useState('my')
	// user ev state
	const [userEvData, setUserEvData] = useState({
		userEvId: '',
		userTypeCd: '',
		userType: '',
		model: '',
		carNum: '',
		nickname: '',
		regDate: '',
	})
	// modal state
	const [sharedInfoModal, setSharedInfoModal] = useState(false)
	const [modalPage, setModalPage] = useState(1)
	// text input
	const [hp, setHp] = useState({ value: '', error: '' })
	const [passwd, setPasswd] = useState({ value: '', error: '' })
	const [visiblePasswd, setVisiblePasswd] = useState(true)

	useFocusEffect(
		useCallback(() => {
			getMyEvList()
			getSharedEvList()
			getReceivedShareList()
		}, []),
	)

	useFocusEffect(
		useCallback(() => {
			setModalPage(1)
		}, [sharedInfoModal]),
	)

	async function getMyEvList() {
		try {
			await GET_MY_EV_LIST(dispatch)
		} catch (e) {
			console.log(e)
		}
	}

	async function getSharedEvList() {
		try {
			await GET_SHARED_EV_LIST(dispatch)
		} catch (e) {
			console.log(e)
		}
	}

	// 보유 차량에 공유된 유저 목록
	async function getSharedUserList(userEvId) {
		try {
			await GET_SHARED_USER_LIST(dispatch, { userEvId })
		} catch (e) {
			console.log(e)
		}
	}

	// 공유 보내기
	function handlePressSendShare() {
		if (validationCheck()) {
			postSendShare()
		}
	}

	// 공유하기 api
	async function postSendShare() {
		try {
			const response = await POST_SEND_SHARE(dispatch, {
				userEvId: userEvData.userEvId,
				hp: hp.value,
				passwd: passwd.value,
			})

			const resData = response.data

			if (resData?.success && resData?.data === 1) {
				setHp({ value: '', error: '' })
				setPasswd({ value: '', error: '' })
				setSharedInfoModal(false)
				$alert('해당 회원에게 공유를 보냈습니다.')
			} else {
				setSharedInfoModal(false)
				$alert(resData.msg)
			}
		} catch (e) {
			console.log('post send share error => ', e)
		}
	}

	// validation
	function validationCheck() {
		const phoneError = PhoneNumberValidator(hp.value)
		const passwordError = sharePasswdValidator(passwd.value)

		if (phoneError || passwordError) {
			setHp({ ...hp, error: phoneError })
			setPasswd({ ...passwd, error: passwordError })
			return false
		}

		return true
	}

	// 공유 중단하기
	async function stopShare(userEvShareId) {
		try {
			const response = await PATCH_STOP_SHARE(dispatch, { userEvShareId })
			const resData = response.data
			if (resData?.success && resData.data === 1) {
				getSharedUserList(userEvData.userEvId)
				setSharedInfoModal(false)
				$alert('공유가 중단 되었습니다.')
			} else {
				setSharedInfoModal(false)
				$alert(resData.msg)
			}
		} catch (e) {
			console.log(e)
		}
	}

	// 공유 해제하기
	async function releaseShare(userEvShareId) {
		try {
			const response = await PATCH_RELEASE_SHARE(dispatch, { userEvShareId })
			const resData = response.data
			if (resData?.success && resData.data === 1) {
				$alert('공유가 해제되었습니다.')
				getSharedEvList()
			}
		} catch (error) {
			console.log(error)
		}
	}

	// 공유 거절하기
	async function refuseShare(shareQueueId) {
		try {
			const response = await PATCH_REFUSE_SHARE(dispatch, { shareQueueId })
			// console.log(response)
			if (response.data.success) {
				if (response.data.data === 1) {
					$alert('공유를 거절하였습니다.')
					getReceivedShareList()
				}
			} else {
				$alert(response.data.msg)
			}
		} catch (e) {
			console.log(e)
		}
	}

	// 공유 대기 목록 api
	async function getReceivedShareList() {
		try {
			const response = await GET_RECEIVED_SHARE_LIST(dispatch, { userId: id })
			const resData = response?.data
			if (resData.success) {
				return resData.data
			}
		} catch (e) {
			console.log(e)
		}
	}

	function handlePressModalOpen() {
		setHp({ value: '', error: '' })
		setPasswd({ value: '', error: '' })

		setSharedInfoModal(true)
	}

	function handlePressModalClose() {
		setHp({ value: '', error: '' })
		setPasswd({ value: '', error: '' })

		setSharedInfoModal(false)
	}

	return (
		<>
			{(myEvListLoading || sharedEvListLoading || sendShareLoading || refuseShareLoading) && <Loading />}

			<Container>
				<TabContents style={styles.shadow}>
					<MyCarTab searchType={searchType} onPress={() => setSearchType('my')}>
						<SmallText style={searchType === 'my' ? styles.selectedText : styles.unSelectedText}>
							{userTypeCd === USER_CORPORATION ? '내 법인 차량' : '내 차량'}
						</SmallText>
					</MyCarTab>

					<SharedCarTab searchType={searchType} onPress={() => setSearchType('shared')}>
						<SmallText style={searchType === 'shared' ? styles.selectedText : styles.unSelectedText}>
							공유받은 차량
						</SmallText>
					</SharedCarTab>
				</TabContents>

				{searchType === 'my' && myEvList.length > 0 ? (
					<ScrollView showsVerticalScrollIndicator={false}>
						{myEvList.map((myEv) => (
							<Contents key={myEv.userEvId} style={styles.shadow}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									{/* label */}
									<LabelView>
										<Image
											source={
												myEv.userTypeCd === USER_PERSONAL
													? require('@assets/icons/personal.png')
													: require('@assets/icons/corporation.png')
											}
										/>
										<View style={{ margin: moderateScale(2.5) }} />
										<SmallText style={styles.boldText}>{myEv.userType}</SmallText>
									</LabelView>
									{/* bar */}
									<View style={styles.verticalBar} />
									{/* text */}
									<View style={{ flex: 1 }}>
										<SmallText style={{ fontSize: moderateScale(15) }}>{myEv.nickname}</SmallText>
										<View style={{ margin: moderateScale(5) }} />
										<SmallText style={styles.boldText}>{myEv.model}</SmallText>
									</View>
									{/* image */}
									<TouchableOpacity
										style={{
											flex: 0.2,
											height: '80%',
											alignItems: 'flex-end',
											justifyContent: 'flex-start',
										}}
										onPress={() => {
											getSharedUserList(myEv.userEvId)
											setUserEvData({
												...userEvData,
												userEvId: myEv.userEvId,
												userTypeCd: myEv.userTypeCd,
												userType: myEv.userType,
												model: myEv.model,
												carNum: myEv.carNum,
												nickname: myEv.nickname,
												regDate: myEv.regDate,
											})
											handlePressModalOpen()
										}}
									>
										<ThreeDotsSvg width={moderateScale(15)} height={moderateScale(15)} />
									</TouchableOpacity>
								</View>
							</Contents>
						))}
					</ScrollView>
				) : searchType === 'shared' && (sharedEvList.length > 0 || receivedShareList.length > 0) ? (
					<ScrollView showsVerticalScrollIndicator={false}>
						{receivedShareList.map((receivedShare) => (
							<Contents key={receivedShare.shareQueueId} style={styles.shadow}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									{/* label */}
									<LabelView>
										<Image source={require('@assets/icons/standby.png')} />
										<View style={{ margin: moderateScale(2.5) }} />
										<SmallText style={styles.boldText}>대기</SmallText>
									</LabelView>
									{/* bar */}
									<View style={styles.verticalBar} />
									{/* text */}
									<View style={{ flex: 1 }}>
										<SmallText style={{ fontSize: moderateScale(15) }}>
											{receivedShare.nickname}
										</SmallText>
										<View style={{ margin: moderateScale(5) }} />
										<SmallText style={styles.boldText}>{receivedShare.model}</SmallText>
									</View>
								</View>

								{/* 공유한 회원 정보 */}
								<ShareUserInfoView>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
										<SmallText style={styles.noramlText}>{receivedShare.fromUserName}</SmallText>

										<Row>
											<TouchableOpacity onPress={() => refuseShare(receivedShare.shareQueueId)}>
												<SmallText style={styles.noramlText}>거절</SmallText>
											</TouchableOpacity>
											<View style={{ marginRight: moderateScale(30) }} />
											<TouchableOpacity
												onPress={() =>
													navigate(MY_CHABAP_TAB_FLOW, {
														screen: MY_CHABAP_FAMILY_TERMS_SCREEN,
														params: {
															shareType: SHARE_TYPE_SHARED,
															shareQueueId: receivedShare.shareQueueId,
															userEvId: receivedShare.userEvId,
															model: receivedShare.model,
														},
													})
												}
											>
												<SmallText style={styles.approveText}>승인</SmallText>
											</TouchableOpacity>
										</Row>
									</View>
									<View style={{ margin: moderateScale(8) }} />
									<View>
										<SmallText style={styles.userInfoText}>{receivedShare.fromUserEmail}</SmallText>
										<View style={{ margin: moderateScale(3) }} />
										<SmallText style={styles.userInfoText}>{receivedShare.fromUserHp}</SmallText>
										<View style={{ margin: moderateScale(3) }} />
										<SmallText style={styles.userInfoText}>
											공유 일시 : {moment(receivedShare.regDate).format('YYYY.MM.DD')}
										</SmallText>
									</View>
								</ShareUserInfoView>
							</Contents>
						))}

						{sharedEvList.map((sharedEv) => (
							<Contents key={sharedEv.userEvId} style={styles.shadow}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									{/* label */}
									<LabelView>
										<Image
											source={
												sharedEv.userTypeCd === USER_PERSONAL
													? require('@assets/icons/personal.png')
													: require('@assets/icons/corporation.png')
											}
										/>
										<View style={{ margin: moderateScale(2.5) }} />
										<SmallText style={styles.boldText}>{sharedEv.userType}</SmallText>
									</LabelView>
									{/* bar */}
									<View style={styles.verticalBar} />
									{/* text */}
									<View style={{ flex: 1 }}>
										<SmallText style={{ fontSize: moderateScale(15) }}>
											{sharedEv.nickname}
										</SmallText>
										<View style={{ margin: moderateScale(5) }} />
										<SmallText style={styles.boldText}>{sharedEv.model}</SmallText>
									</View>
								</View>

								{/* 공유한 회원 정보 */}
								<ShareUserInfoView>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
										<SmallText style={styles.noramlText}>{sharedEv.fromUserName}</SmallText>

										<Row>
											<TouchableOpacity onPress={() => releaseShare(sharedEv.userEvShareId)}>
												<SmallText style={styles.approveText}>공유해제</SmallText>
											</TouchableOpacity>
										</Row>
									</View>
									<View style={{ margin: moderateScale(8) }} />
									<SmallText style={styles.userInfoText}>{sharedEv.fromUserEmail}</SmallText>
									<View style={{ margin: moderateScale(3) }} />
									<SmallText style={styles.userInfoText}>{sharedEv.fromUserHp}</SmallText>
									<View style={{ margin: moderateScale(3) }} />
									<SmallText style={styles.userInfoText}>
										공유 일시 : {moment(sharedEv.regDate).format('YYYY.MM.DD')}
									</SmallText>
								</ShareUserInfoView>
							</Contents>
						))}
					</ScrollView>
				) : (
					<EemptyView>
						<ExclamationGraySvg width={moderateScale(38)} height={moderateScale(38)} />
						<View style={{ margin: moderateScale(10) }} />
						<SmallText style={styles.emptyText}>등록된 차량이 없습니다.</SmallText>
						<View style={{ margin: moderateScale(5) }} />
						<SmallText style={styles.emptyText}>차량을 공유하기 위해서 내 차량을 등록해주세요.</SmallText>
					</EemptyView>
				)}
			</Container>

			{/* Button */}
			{searchType === 'my' && myEvList.length < 1 ? (
				<AddCarButtonView>
					<AddCarButton onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: MY_INFO_CAR_MNGT_SCREEN })}>
						<SmallText style={styles.buttonText}>내 차량 등록하기</SmallText>
					</AddCarButton>
				</AddCarButtonView>
			) : null}

			{/* Modal */}
			<Modal.Common
				transparent={true}
				visible={sharedInfoModal}
				animationType="fade"
				setClose={() => handlePressModalClose()}
			>
				<ModalContainer>
					<CloseButtonView onPress={() => handlePressModalClose()}>
						{/* Close Button Space */}
					</CloseButtonView>

					<ModalWrap>
						<KeyboardAvoidingView
							style={{ flex: 1 }}
							behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
						>
							<DetailHeader>
								{/* label */}
								<View style={{ alignItems: 'center', justifyContent: 'center' }}>
									<Image
										source={
											userEvData.userTypeCd === USER_PERSONAL
												? require('@assets/icons/personal.png')
												: require('@assets/icons/corporation.png')
										}
									/>
									<View style={{ margin: moderateScale(2.5) }} />
									<SmallText>{userEvData.userType}</SmallText>
								</View>
								{/* bar */}
								<View style={styles.verticalBar} />
								{/* text */}
								<View style={{ flex: 1 }}>
									<Row style={{ justifyContent: 'space-between' }}>
										<SmallText style={{ fontSize: moderateScale(15) }}>
											{userEvData.nickname}
										</SmallText>
										<SmallText style={{ color: theme.colors.placeholder }}>
											{moment(userEvData.regDate).format('YY.MM.DD')}{' '}
										</SmallText>
									</Row>

									<View style={{ margin: moderateScale(2) }} />

									<SmallText style={styles.boldText}>{userEvData.model}</SmallText>

									<View style={{ margin: moderateScale(2) }} />

									<SmallText style={{ color: theme.colors.placeholder }}>
										{userEvData.carNum}
									</SmallText>
								</View>
							</DetailHeader>

							{modalPage === 1 ? (
								sharedUserList.length > 0 ? (
									<ScrollView showsVerticalScrollIndicator={false}>
										{sharedUserList.map((sharedUser, index) => (
											<DetailContents key={index}>
												<View
													style={{
														flexDirection: 'row',
														justifyContent: 'space-between',
													}}
												>
													<View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<SmallText style={styles.boldText}>{sharedUser.name}</SmallText>
														<UsingLabel>
															<SmallText style={{ color: theme.colors.turquoise }}>
																사용중
															</SmallText>
														</UsingLabel>
													</View>
													<View style={{ justifyContent: 'center' }}>
														<StopButton
															style={styles.shadow}
															onPress={() => stopShare(sharedUser.userEvShareId)}
														>
															<SmallText style={styles.stopText}>공유 중단</SmallText>
														</StopButton>
													</View>
												</View>
												<View style={{ margin: moderateScale(3) }} />
												<SmallText>{sharedUser.email}</SmallText>
												<View style={{ margin: moderateScale(3) }} />
												<SmallText>{sharedUser.hp}</SmallText>
												<View style={{ margin: moderateScale(3) }} />
												<SmallText>
													공유 일시 : {moment(sharedUser.regDate).format('YYYY.MM.DD')}
												</SmallText>
												<View style={{ margin: moderateScale(5) }} />
											</DetailContents>
										))}
									</ScrollView>
								) : (
									<EemptyView>
										<ExclamationGraySvg width={moderateScale(38)} height={moderateScale(38)} />
										<View style={{ margin: moderateScale(10) }} />
										<SmallText style={styles.emptyText}>
											현재 이 차량으로 공유한 내역이 없습니다.
										</SmallText>
									</EemptyView>
								)
							) : modalPage === 2 ? (
								<ScrollView showsVerticalScrollIndicator={false}>
									<CautionView>
										<SmallText>공유해주실 고객님과 공유받으실 고객님 모두 차밥 앱에</SmallText>
										<View style={{ margin: moderateScale(2) }} />
										<Row>
											<SmallText style={{ color: theme.colors.turquoise }}>로그인</SmallText>
											<SmallText> 되어 있으셔야 하며,</SmallText>
										</Row>
										<View style={{ margin: moderateScale(2) }} />
										<Row>
											<SmallText>차밥앱의 </SmallText>
											<SmallText style={{ color: theme.colors.turquoise }}>
												알림 관련 권한을 허용
											</SmallText>
											<SmallText> 해두셔야 합니다.</SmallText>
										</Row>
									</CautionView>

									<TextInputView style={{ marginBottom: hp.error ? verticalScale(15) : 0 }}>
										<SmallText style={{ flex: 0.2 }}>휴대폰</SmallText>
										<TextInput
											type={'text'}
											placeholder="공유받는 식구의 휴대폰 번호"
											value={hp.value}
											errorText={hp.error}
											isShadow={false}
											style={styles.textInput}
											onChangeText={(text) => setHp({ value: text, error: '' })}
											setRemoveText={() => setHp({ value: '', error: '' })}
											keyboardType="number-pad"
											returnKeyType="done"
											onSubmitEditing={() => {}}
										/>
									</TextInputView>

									<TextInputView style={{ marginBottom: passwd.error ? verticalScale(15) : 0 }}>
										<SmallText style={{ flex: 0.2 }}>비밀번호</SmallText>
										<TextInput
											type={'password'}
											placeholder="공유 비밀번호 설정(4자리)"
											value={passwd.value}
											errorText={passwd.error}
											secureTextEntry={visiblePasswd}
											isShadow={false}
											style={styles.textInput}
											onChangeText={(text) => setPasswd({ value: text, error: '' })}
											setRemoveText={() => setPasswd({ value: '', error: '' })}
											setVisible={() => setVisiblePasswd(!visiblePasswd)}
											keyboardType="number-pad"
											returnKeyType="done"
											blurOnSubmit={false}
											onSubmitEditing={() => {}}
										/>
									</TextInputView>

									<View style={{ alignItems: 'flex-end', padding: moderateScale(5) }}>
										<SmallText style={{ color: theme.colors.turquoise }}>
											*공유 받는 차밥 식구에게 비밀번호를 알려주세요.
										</SmallText>
									</View>

									<View style={{ marginBottom: verticalScale(40) }} />
								</ScrollView>
							) : null}

							{modalPage === 1 ? (
								<ShareButton onPress={() => setModalPage(2)}>
									<Image source={require('@assets/icons/share.png')} tintColor={'#fff'} />
									<View style={{ margin: moderateScale(5) }} />
									<SmallText style={styles.buttonText}>이 차량 공유하기</SmallText>
								</ShareButton>
							) : modalPage === 2 ? (
								<ShareButton onPress={() => handlePressSendShare()}>
									<Image source={require('@assets/icons/share.png')} tintColor={'#fff'} />
									<View style={{ margin: moderateScale(5) }} />
									<SmallText style={styles.buttonText}>공유 보내기</SmallText>
								</ShareButton>
							) : null}
						</KeyboardAvoidingView>
					</ModalWrap>
				</ModalContainer>
			</Modal.Common>
		</>
	)
}

const styles = StyleSheet.create({
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
	selectedText: {
		fontWeight: '600',
		fontSize: moderateScale(15),
		color: theme.colors.white,
	},
	unSelectedText: {
		fontWeight: '500',
		fontSize: moderateScale(15),
	},
	noramlText: {
		fontSize: moderateScale(15),
	},
	boldText: {
		fontWeight: 'bold',
		fontSize: moderateScale(15),
	},
	stopText: {
		fontWeight: 'bold',
		fontSize: moderateScale(15),
		color: '#ff8800',
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
	},
	emptyText: {
		fontWeight: '500',
		fontSize: moderateScale(15),
		color: '#797979',
	},
	approveText: {
		fontWeight: '500',
		fontSize: moderateScale(15),
		color: theme.colors.turquoise,
	},
	verticalBar: {
		height: '100%',
		borderLeftWidth: verticalScale(1),
		borderColor: theme.colors.disabled,
		marginLeft: horizontalScale(20),
		marginRight: horizontalScale(20),
	},
	textInput: {
		flex: 0.8,
		borderWidth: moderateScale(1),
		borderRadius: moderateScale(8),
		borderColor: theme.colors.disabled,
	},
	userInfoText: {
		color: theme.colors.placeholder,
	},
})
