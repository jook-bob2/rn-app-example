import TextInput from '@/components/ui/input/TextInput'
import Loading from '@/components/ui/Loading'
import SmallText from '@/components/ui/text/SmallText'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import { POST_USER_SIGN_UP_CORP } from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { corpNumberValidator } from '@/utils/validator'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { useRoute } from '@react-navigation/native'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import { CancelSvg, PlusSmallSvg, SearchSvg } from '@util/svgUtil'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
	Dimensions,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import styled from 'styled-components/native'

const { CORP_SIGN_UP_CAR_INPUT_SCREEN, MAIN_TAB_FLOW, ADDRESS_FIND_SCREEN } = constants
const Container = styled.View`
	width: 100%;
	flex: 1;
	background-color: ${theme.colors.white};
`
const Wrap = styled.View`
	padding: ${moderateScale(24)}px;
	background-color: ${theme.colors.white};
`
const ProgessView = styled.View`
	width: 100%;
	height: ${verticalScale(3)}px;
	background-color: ${theme.colors.turquoise};
`

const Footer = styled.View`
	justify-content: flex-end;
	align-items: center;
	background-color: ${theme.colors.white};
`

const TextVew = styled.View`
	background-color: ${theme.colors.background};
	margin-top: ${verticalScale(8)}px;
`
const FileUploadView = styled.View`
	flex-direction: row;
`
const ConfirmButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 90%;
	height: ${verticalScale(50)}px;
	background-color: ${theme.colors.turquoise};
	flex-direction: row;
	border-color: ${theme.colors.white};
	border-radius: ${moderateScale(8)}px;
	border-width: ${moderateScale(1)}px;
`
const PressableView = styled.View`
	background-color: ${theme.colors.white};
	padding-bottom: ${verticalScale(5)}px;
	padding-left: ${moderateScale(10)}px;
	border-bottom-width: ${verticalScale(1)}px;
	border-bottom-color: ${theme.colors.line};
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`

const UploadBtnView = styled.View`
	margin-top: ${verticalScale(12)}px;
	width: ${moderateScale(100)}px;
	height: ${moderateScale(36)}px;

	border-radius: ${moderateScale(25)}px;
	border-width: ${moderateScale(1)}px;
	background-color: ${theme.colors.white};
	border-color: ${theme.colors.darkGray};
	flex-direction: row;
	align-items: center;
	justify-content: center;
`

const ConfirmView = styled.View`
	justify-content: center;
	align-items: center;
`

const winHeight = Dimensions.get('window').height
export default function CorpSignUpCorpInput() {
	const { navigate, reset } = useNavigation()
	const { $confirm, closeConfirm } = useConfirm()
	const { params } = useRoute()
	const { $alert } = useAlert()
	const scrollRef = useRef()
	//console.log(params.companyInfos.alarmFlag)
	const { dispatch: userDispatch } = useUserContext()
	const [isKeyboardShow, setIsKeyboardShow] = useState(false)
	const { onLoginSuccess, saveSignInHistory } = useUser()
	const [loading, setLoading] = useState(false)
	const [corpInfo, setCorpInfo] = useState({
		userInfo: {
			email: '',
			passwd: '',
			userTypeCd: '',
			gender: '',
			birthdate: '',
			name: '',
			hp: '',
			verifyFlag: '',
			hpCoCd: '',
			frnrFlag: '',
		},
		companyName: '',
		bizRegNum: '',
		companyRepresentative: '',
		bizType: '',
		bizItem: '',
		phone: '',
		addr1: '',
		addr2: '',
		alarmFlag: '',
		fileName: '',
		fileUri: '',
	})
	// const [uploadFile, setUploadFile] = useState({ fileName: '', fileUri: '' })

	useFocusEffect(
		useCallback(() => {
			setCorpInfo({
				...params?.companyInfos,
				// userInfo: params?.companyInfos?.userInfo || '',
				// email: params?.companyInfos?.email || '',
				// passwd: params?.companyInfos?.passwd || '',
				// companyName: params?.companyInfos?.companyName || '',
				// bizRegNum: params?.companyInfos?.bizRegNum || '',
				// companyRepresentative: params?.companyInfos?.companyRepresentative || '',
				// bizType: params?.companyInfos?.bizType || '',
				// bizItem: params?.companyInfos?.bizItem || '',
				// phone: params?.companyInfos?.phone || '',
				// addr1: params?.companyInfos?.addr1 || '',
				// addr2: params?.companyInfos?.addr2 || '',
				// alarmFlag: params?.companyInfos?.alarmFlag || '',
			})
		}, [params]),
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
	const corpNumInput = useRef()
	const corpNmInput = useRef()
	const corpBizTypeInput = useRef()
	const corpBizItemInput = useRef()
	const corpFileName = useRef()
	const corpSubAddrInput = useRef()
	const corpRepresentInput = useRef()
	function handleValidate(data) {
		if (!data.companyName) {
			corpNmInput.current.focus()
			$alert('법인명을 입력하세요')
			return false
		} else if (!data.bizRegNum) {
			console.log('ccc')
			corpNumInput.current.focus()
			$alert('사업자번호를 입력하세요')
			return false
		} else if (!data.fileName) {
			$alert('파일을 업로드해주세요')
			corpFileName.current.focus()
			return false
		} else if (!data.companyRepresentative) {
			corpRepresentInput.current.focus()
			$alert('대표자를 입력하세요')
			return false
		} else if (!data.bizType) {
			corpBizTypeInput.current.focus()
			$alert('업태를 입력하세요')
			return false
		} else if (!data.bizItem) {
			corpBizItemInput.current.focus()
			$alert('업종을 입력하세요')
			return false
		} else if (!data.addr1) {
			$alert('주소를 검색해주세요')
		} else if (!data.addr2) {
			corpSubAddrInput.current.focus()
			$alert('상세주소를 입력하세요')
			return false
		}
		const bizRegNumError = corpNumberValidator(data.bizRegNum)
		if (bizRegNumError) {
			$alert(bizRegNumError)
			return false
		}
		return true
	}
	async function handleSignUp() {
		if (handleValidate(corpInfo)) {
			setLoading(true)
			try {
				// const date = corpInfo.userInfo.birthdate
				const formData = new FormData()

				formData.append('userInfo.email', corpInfo.userInfo.email)
				formData.append('userInfo.passwd', corpInfo.userInfo.passwd)
				formData.append('userInfo.userTypeCd', corpInfo.userInfo.userTypeCd)
				formData.append('userInfo.name', corpInfo.userInfo.name)
				formData.append('userInfo.hp', corpInfo.userInfo.hp)
				formData.append('userInfo.birthdate', corpInfo.userInfo.birthdate)
				formData.append('userInfo.verifyFlag', corpInfo.userInfo.verifyFlag)
				formData.append('userInfo.gender', corpInfo.userInfo.gender)
				formData.append('userInfo.hpCoCd', corpInfo.userInfo.hpCoCd)
				formData.append('userInfo.frnrFlag', corpInfo.userInfo.frnrFlag)
				formData.append('companyName', corpInfo.companyName)
				formData.append('companyRepresentative', corpInfo.companyRepresentative)
				formData.append('bizRegNum', corpInfo.bizRegNum)
				formData.append('bizType', corpInfo.bizType)
				formData.append('bizItem', corpInfo.bizItem)
				formData.append('phone', corpInfo.phone)
				formData.append('addr1', corpInfo.addr1)
				formData.append('addr2', corpInfo.addr2)
				formData.append('hpCoCd', corpInfo.hpCoCd)
				formData.append('frnrFlag', corpInfo.frnrFlag)
				formData.append('alarmSelectedRequest.emailFlag', params?.companyInfos?.alarmFlag?.emailFlag)
				formData.append('alarmSelectedRequest.pushFlag', params?.companyInfos?.alarmFlag?.pushFlag)
				formData.append('alarmSelectedRequest.smsFlag', params?.companyInfos?.alarmFlag?.smsFlag)
				formData.append('uploadFile', {
					type: 'multipart/form-data',
					uri: corpInfo.fileUri,
					name: corpInfo.fileName,
				})

				const response = await POST_USER_SIGN_UP_CORP(userDispatch, formData, {
					headers: {
						'content-type': 'multipart/form-data',
					},
					// userInfo: corpInfo.userInfo,
					// companyName: corpInfo.companyName,
					// companyRepresentative: corpInfo.companyRepresentative,
					// bizRegNum: corpInfo.bizRegNum,
					// bizType: corpInfo.bizType,
					// bizItem: corpInfo.bizItem,
					// phone: corpInfo.phone,
					// addr1: corpInfo.addr1,
					// addr2: corpInfo.addr2,
					// hpCoCd: corpInfo.hpCoCd,
					// frnrFlag: corpInfo.frnrFlag,
					// alarmSelectedRequest: corpInfo.alarmFlag,
				})
				const resData = response.data
				setLoading(false)
				if (resData.success && resData?.data?.accessToken) {
					const isLogin = await onLoginSuccess({ ...resData.data, autoSign: true })

					if (isLogin) {
						$confirm({
							msg: (
								<ConfirmView>
									<SmallText
										style={{
											color: theme.colors.text,
											fontFamily: theme.fonts.spoqaHanSansNeo.bold,
											marginBottom: horizontalScale(5),
										}}
									>
										회원가입이 완료되었습니다.
									</SmallText>
									<SmallText
										style={{
											color: theme.colors.text,
											fontFamily: theme.fonts.spoqaHanSansNeo.bold,
										}}
									>
										차량등록을 하시겠습니까?
									</SmallText>
								</ConfirmView>
							),
							cancelButtonName: '나중에',
							confirmButtonName: '등록',
							onPress: (r) => {
								if (r === true) {
									closeConfirm()
									setTimeout(() => {
										reset({
											routes: [
												{
													name: CORP_SIGN_UP_CAR_INPUT_SCREEN,
												},
											],
										})
									}, 1000)
								} else {
									closeConfirm()
									setTimeout(() => {
										reset({ routes: [{ name: MAIN_TAB_FLOW }] })
									}, 1000)
								}
							},
						})

						// 로그인 후 로그인 히스토리 저장
						const histResult = await saveSignInHistory(resData.data.id)
						const { success, msg } = histResult
						if (!success) {
							setTimeout(() => {
								$alert(msg)
							}, 1000)
						}
					}
				} else if (resData.code === 'ESVC039') {
					$alert(resData.msg)
				} else if (resData.code === 'ESVC001') {
					$alert(resData.msg)
				} else if (resData.code === 'ESVC000') {
					$alert(resData.msg)
				}
			} catch (error) {
				setLoading(false)
				console.log('signup error => ', error)
			}
		}
	}
	const findAddress = () => {
		//주소 api불러서 여기에 데이터 입력
		navigate(ADDRESS_FIND_SCREEN, { companyInfo: corpInfo })
	}
	async function handleIamgePicker() {
		try {
			await ImagePicker.openPicker({
				width: 300,
				height: 400,
				cropping: false,
				multiple: false,
			}).then((image) => {
				const name = image.path.split('/').pop()
				const path = image.path

				setCorpInfo({ ...corpInfo, fileName: name, fileUri: path })
			})
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<ProgessView />
			{loading && <Loading />}

			<Container>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					// style={{ flex: 1, backgroundColor: theme.colors.white }}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={Platform.OS === 'ios' ? winHeight * 0.2 : winHeight * 0.2}
				>
					<ScrollView ref={scrollRef} keyboardShouldPersistTaps={'handled'}>
						<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
							<Wrap>
								<SmallText style={styles.textView}>법인명</SmallText>

								<TextInput
									placeholder="법인명을 입력하세요."
									placeholderTextColor={theme.colors.placeholder}
									value={corpInfo.companyName}
									type={'text'}
									setRemoveText={() => setCorpInfo({ ...corpInfo, companyName: '' })}
									isShadow={false}
									onChangeText={(text) => setCorpInfo({ ...corpInfo, companyName: text })}
									inputStyle={styles.inputViewEditable}
									style={{
										...styles.textInput,
										//	marginBottom: newPassword.error ? verticalScale(38) : verticalScale(16),
									}}
									childRef={corpNmInput}
								/>

								<SmallText style={styles.textView}>사업자번호</SmallText>

								<TextInput
									placeholder="숫자만 입력하세요."
									placeholderTextColor={theme.colors.placeholder}
									keyboardType="numeric"
									maxLength={10}
									isShadow={false}
									value={corpInfo.bizRegNum}
									type={'text'}
									setRemoveText={() => setCorpInfo({ ...corpInfo, bizRegNum: '' })}
									inputStyle={styles.inputViewEditable}
									onChangeText={(text) => setCorpInfo({ ...corpInfo, bizRegNum: text })}
									style={{
										...styles.textInput,
										//	marginBottom: newPassword.error ? verticalScale(38) : verticalScale(16),
									}}
									childRef={corpNumInput}
								/>

								<SmallText style={styles.textView}>사업자등록증명원</SmallText>
								<FileUploadView>
									<TextInput
										placeholder={'파일을 첨부해주세요'}
										placeholderTextColor={theme.colors.placeholder}
										style={{
											...styles.fileInput,
											flex: 2,
										}}
										value={corpInfo.fileName}
										isShadow={false}
										inputStyle={styles.inputViewEditable}
										editable={false}
										selectTextOnFocus={false}
										childRef={corpFileName}
									/>
									{corpInfo.fileName ? (
										<TouchableOpacity
											style={{
												borderBottomColor: theme.colors.line,
												borderBottomWidth: moderateScale(1),
												marginTop: verticalScale(25),
												marginRight: verticalScale(15),
											}}
											onPress={() => setCorpInfo({ ...corpInfo, fileName: '', fileUri: '' })}
										>
											<CancelSvg width={moderateScale(13)} height={moderateScale(13)} />
										</TouchableOpacity>
									) : null}
									<Pressable onPress={() => handleIamgePicker()}>
										<UploadBtnView>
											<Left>
												<SmallText style={styles.uploadBtn}>파일첨부</SmallText>
											</Left>
											<Right>
												<PlusSmallSvg width={moderateScale(12)} height={moderateScale(12)} />
											</Right>
										</UploadBtnView>
									</Pressable>
								</FileUploadView>
								<TextVew>
									<Text style={styles.infotext}>
										*사업자 등록 증명원은 국제청 홈택스에서 발급 가능합니다.
									</Text>
									<Text style={styles.infotext}>발급일로 부터 7일 이내인 서류를 업로드해주세요.</Text>
									<Text style={styles.infotext}>
										*조건에 맞지 않는 서류 제출 시 차밥 이용이 제한이 될 수 있습니다.
									</Text>
									<Text style={styles.infotext}>*png, jpg, pdf 를 업로드 해주세요.</Text>
								</TextVew>
								<SmallText style={styles.textView}>대표자</SmallText>

								<TextInput
									placeholder="대표자 명을 입력하세요."
									value={corpInfo.companyRepresentative}
									type={'text'}
									setRemoveText={() => setCorpInfo({ ...corpInfo, companyRepresentative: '' })}
									onChangeText={(text) => setCorpInfo({ ...corpInfo, companyRepresentative: text })}
									isShadow={false}
									inputStyle={styles.inputViewEditable}
									// errorText={}
									style={{
										...styles.textInput,
										//	marginBottom: newPassword.error ? verticalScale(38) : verticalScale(16),
									}}
									childRef={corpRepresentInput}
								/>

								<SmallText style={styles.textView}>업태</SmallText>

								<TextInput
									placeholder="업태를 입력하세요."
									placeholderTextColor={theme.colors.placeholder}
									value={corpInfo.bizType}
									type={'text'}
									setRemoveText={() => setCorpInfo({ ...corpInfo, bizType: '' })}
									isShadow={false}
									inputStyle={styles.inputViewEditable}
									onChangeText={(text) => setCorpInfo({ ...corpInfo, bizType: text })}
									// errorText={}
									style={{
										...styles.textInput,
										//	marginBottom: newPassword.error ? verticalScale(38) : verticalScale(16),
									}}
									childRef={corpBizTypeInput}
								/>

								<SmallText style={styles.textView}>업종</SmallText>

								<TextInput
									placeholder="업종을 입력하세요."
									placeholderTextColor={theme.colors.placeholder}
									value={corpInfo.bizItem}
									type={'text'}
									setRemoveText={() => setCorpInfo({ ...corpInfo, bizItem: '' })}
									isShadow={false}
									inputStyle={styles.inputViewEditable}
									onChangeText={(text) => setCorpInfo({ ...corpInfo, bizItem: text })}
									// errorText={}
									style={{
										...styles.textInput,
										//	marginBottom: newPassword.error ? verticalScale(38) : verticalScale(16),
									}}
									childRef={corpBizItemInput}
								/>

								<SmallText style={styles.textViewAddr}>주소</SmallText>
								<Pressable onPress={() => findAddress()}>
									<PressableView>
										<Left>
											{!corpInfo.addr1 ? (
												<SmallText style={styles.inputViewEditableAddr}>
													도로명, 지번, 건물명 검색
												</SmallText>
											) : (
												<SmallText style={styles.inputViewAddr}>{corpInfo.addr1}</SmallText>
											)}
										</Left>
										<Right>
											<SearchSvg
												style={{ marginRight: horizontalScale(25) }}
												width={moderateScale(16)}
												height={moderateScale(16)}
											/>
										</Right>
									</PressableView>
									{/* <AddressInput
									placeholder="도로명, 지번, 건물명 검색"
									value={corpInfo.addr1}
									inputStyle={styles.inputViewEditable}
									labelStyle={styles.searchStyle}
									buttonTitle={
										<SearchSvg
											width={moderateScale(20)}
											height={moderateScale(20)}
										/>
									}
									pressButton={() => findAddress()}
									editable={false}
									selectTextOnFocus={false}
									style={{
										...styles.textInput,
									}}
								/> */}
								</Pressable>
								<TextInput
									placeholder="상세주소 입력하세요."
									placeholderTextColor={theme.colors.placeholder}
									value={corpInfo.addr2}
									type={'text'}
									onChangeText={(text) => setCorpInfo({ ...corpInfo, addr2: text })}
									setRemoveText={() => setCorpInfo({ ...corpInfo, addr2: '' })}
									style={{
										...styles.textInput,
										//	marginBottom: newPassword.error ? verticalScale(38) : verticalScale(16),
									}}
									isShadow={false}
									inputStyle={styles.inputViewEditable}
									returnKeyType="done"
									blurOnSubmit={false}
									onSubmitEditing={handleSignUp}
									childRef={corpSubAddrInput}
								/>
							</Wrap>
						</TouchableWithoutFeedback>
					</ScrollView>
					<Footer>
						<ConfirmButton
							style={{
								marginBottom: !isKeyboardShow ? verticalScale(40) : 0,
								backgroundColor:
									corpInfo.companyName &&
									corpInfo.companyRepresentative &&
									corpInfo.bizRegNum &&
									corpInfo.bizType &&
									corpInfo.bizItem &&
									corpInfo.addr1 &&
									corpInfo.addr2 &&
									corpInfo.fileName
										? theme.colors.turquoise
										: theme.colors.disabled,
							}}
							onPress={() => handleSignUp()}
						>
							<SmallText style={styles.buttonText}>회원가입</SmallText>
						</ConfirmButton>
					</Footer>
				</KeyboardAvoidingView>
			</Container>
		</>
	)
}
const styles = StyleSheet.create({
	searchStyle: {
		padding: moderateScale(5),
		marginTop: verticalScale(10),
	},
	button: {
		alignSelf: 'center',
		marginTop: verticalScale(40),
	},
	fileInput: {
		borderBottomColor: theme.colors.line,
		flex: 1,
		borderBottomWidth: moderateScale(1),
	},
	textInput: {
		borderBottomColor: theme.colors.line,
		borderBottomWidth: moderateScale(1),
	},
	inputViewEditable: {
		backgroundColor: theme.colors.white,
		borderRadius: moderateScale(5),
		paddingBottom: verticalScale(5),
		lineHeight: moderateScale(20),
		color: theme.colors.text,
		paddingLeft: moderateScale(10),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		fontSize: moderateScale(16),
	},
	textView: {
		marginTop: verticalScale(20),
		marginLeft: horizontalScale(10),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		alignSelf: 'flex-start',
	},
	textViewAddr: {
		marginTop: verticalScale(20),
		marginLeft: horizontalScale(10),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		alignSelf: 'flex-start',
		marginBottom: verticalScale(16),
	},
	inputView: {
		flex: 5,
	},
	keybordView: {
		opacity: 0.5,
	},
	scrollView: {
		paddingHorizontal: horizontalScale(20),
	},
	container: {
		flex: 1,
	},
	infotext: {
		color: theme.colors.placeholder,
		alignSelf: 'flex-start',
		marginLeft: horizontalScale(10),
		fontSize: moderateScale(12),
	},
	addrButton: {
		width: '20%',
		height: verticalScale(35),
		borderRadius: 25,
		backgroundColor: theme.colors.turquoise,
		borderColor: theme.colors.disabled,
		marginRight: moderateScale(10),
	},
	text: {
		width: '100%',
		fontSize: moderateScale(13),
		lineHeight: 18,
		color: '#ffffff',
		fontFamily: `${theme.fonts.spoqaHanSansNeo.bold}`,
	},
	findAddrStyle: {
		flex: 1,
		paddingTop: 7,
	},
	inputStyle: {
		flex: 3,
	},
	textUpload: {
		fontSize: moderateScale(12),
		lineHeight: verticalScale(18),
		backgroundColor: theme.colors.danger,
		color: theme.colors.text,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},

	buttonText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		fontSize: moderateScale(16),
		color: theme.colors.white,
	},

	inputViewEditableAddr: {
		backgroundColor: theme.colors.white,
		color: '#999999',
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	inputViewAddr: {
		backgroundColor: theme.colors.white,
		color: theme.colors.text,
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	uploadBtn: {
		fontSize: moderateScale(14),
		backgroundColor: theme.colors.white,
		color: theme.colors.text,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
})
