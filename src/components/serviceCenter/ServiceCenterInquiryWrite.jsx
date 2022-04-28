import Checkbox from '@/components/ui/checkbox/Checkbox'
import Paragraph from '@/components/ui/text/Paragraph'
import { ServiceCenterTypeCd } from '@/constants/boardConst'
import commCodeConst from '@/constants/commCodeConst'
import { POST_INQUIRY_INSERT } from '@/core/store/api/create/boardCreate'
import { GET_COMM_CODE_SEARCH_LIST } from '@/core/store/api/create/commCodeCreate'
import { useBoardContext } from '@/core/store/api/providers/BoardApiProvider'
import { useCommCodeContext } from '@/core/store/api/providers/CommCodeApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { AwesomeStarSvg, CameraSvg, CloseCircleSvg } from '@/utils/svgUtil'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { device, horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React, { useCallback, useEffect, useState } from 'react'
import {
	Dimensions,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import styled from 'styled-components/native'
import Loading from '../ui/Loading'
import Select from '../ui/select/Select'
import SmallText from '../ui/text/SmallText'
import Row from '../ui/view/Row'

const { INQUIRY_TYPE_CD } = commCodeConst
const { MY_CHABAP_TAB_FLOW, INQUIRY_LIST_SCREEN } = constants

const Contents = styled.View`
	padding: ${moderateScale(25)}px;
`

const Selectcontent = styled.View`
	margin-bottom: ${verticalScale(8)}px;
`

const Bodycontent = styled.View`
	background-color: ${theme.colors.white};
	margin-bottom: ${verticalScale(8)}px;
	justify-content: center;
	padding-left: ${horizontalScale(16)}px;
	/* padding: ${moderateScale(16)}px;
	padding-top: ${moderateScale(0)}px;
	margin-top: ${moderateScale(6)}px;
	margin-bottom: ${moderateScale(6)}px;
	height: ${verticalScale(320)}px;
	border-radius: ${moderateScale(5)}px; */
`
const Btncontent = styled.View`
	justify-content: space-between;
	align-items: center;
`

const ImgContent = styled.View``
const Noticecontent = styled.View`
	padding-top: ${moderateScale(15)}px;
`
const ImgTextcontent = styled.View`
	flex-direction: column;
	margin-bottom: ${moderateScale(20)}px;
`
const Checkboxcontent = styled.View`
	flex-direction: row;
	padding-left: ${moderateScale(5)}px;
	padding-top: ${moderateScale(15)}px;
`
const Buttoncontent = styled.View`
	width: ${device.width - horizontalScale(50)}px;
	justify-content: center;
	align-items: center;
	align-self: center;
	/* padding-top: ${moderateScale(15)}px;
	margin-top: ${moderateScale(40)}px; */
`
const TrueImg = styled.Image`
	width: ${moderateScale(10)}px;
	height: ${moderateScale(10)}px;
	tint-color: ${theme.colors.white};
`

const ConfirmButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 100%;
	height: ${verticalScale(55)}px;
	background-color: ${theme.colors.turquoise};
	border-color: ${theme.colors.white};
	border-width: 0px;
	border-radius: ${moderateScale(8)}px;
	flex-direction: row;
`

const StarViewContainer = styled.View`
	position: absolute;
	flex-direction: row;
	z-index: 9999;
`

const DotView = styled.View`
	width: 4px;
	height: 4px;
	align-self: center;
	margin-right: 8px;
	border-radius: 2px;
	background-color: ${theme.colors.placeholder};
`

const EmptyView = styled.View`
	width: 4px;
	height: 4px;
	align-self: center;
	margin-right: 8px;
	background-color: rgba(0, 0, 0, 0);
`

const winHeight = Dimensions.get('window').height

function StarView({ containerStyle, starStyle, imageStyle, isValue, children }) {
	return (
		<StarViewContainer style={containerStyle}>
			{!isValue && <AwesomeStarSvg width={4} height={4} style={{ ...starStyle, zIndex: 9999 }} />}
		</StarViewContainer>
	)
}

export default function ServiceCenterInquiryWrite() {
	const { replace } = useNavigation()
	const [subject, setSubject] = useState({ value: '', error: '' })
	const [content, setContent] = useState({ value: '', error: '' })
	const { userState } = useUser()
	const [imageList, setImageList] = useState([])
	const { state: boardState, dispatch: boardDispatch } = useBoardContext()
	const { loading: insertLoading } = boardState.inquiryInsert
	const { $alert } = useAlert()
	const { state: codeState, dispatch: codeDispatch } = useCommCodeContext()
	const [commCodeList, setCommCodeList] = useState([])
	const { data: commListData } = codeState.commCodeSearchList
	const commList = commListData?.data || []
	const [isOpen, setIsOpen] = useState(false)
	const [check, setCheck] = useState({
		firstCheck: false,
		secondCheck: false,
	})
	const [codeValue, setCodeValue] = useState('')
	const [code, setCode] = useState({ value: '', error: '' })

	useFocusEffect(
		useCallback(() => {
			setCheck({ value: '' })
			setSubject({ value: '' })
			setContent({ value: '' })
			setImageList([])
			setCommCodeList(commCodeList)
			setCodeValue('')
			setCode({ value: '' })
		}, []),
	)

	useEffect(() => {
		if (check.firstCheck && check.secondCheck) setCheck({ ...check })
		else setCheck({ ...check })
	}, [])

	const removePhoto = (index) => {
		setImageList(imageList.filter((items, i) => i !== index))
	}

	function handlePressCheck(value, name) {
		setCheck({
			...check,
			[name]: value,
		})
	}

	function validationCheck() {
		if (!code.value) {
			$alert('문의유형을 선택해주세요.')
			return false
		}

		if (!subject.value) {
			$alert('제목을 입력해주세요.')
			return false
		}

		if (!content.value) {
			$alert('내용을 입력해주세요.')
			return false
		}

		if (!check.firstCheck || !check.secondCheck) {
			$alert('필수 이용약관에 동의해주세요.')
			return false
		}

		return true
	}

	async function saveInquiry() {
		if (validationCheck()) {
			try {
				const formData = new FormData()
				formData.append('subject', subject.value)
				formData.append('content', content.value)
				formData.append('categoryCd', code.value)
				formData.append('boardCd', ServiceCenterTypeCd.INQUIRY)
				formData.append('userId', userState.id)
				imageList.forEach((image) => {
					formData.append('fileList', {
						type: 'multipart/form-data',
						uri: image.path,
						name: image.path.split('/').pop(),
					})
				})

				const response = await POST_INQUIRY_INSERT(boardDispatch, formData, {
					headers: {
						'content-type': 'multipart/form-data',
					},
				})
				const resData = response.data
				if (resData?.code === 'SUCCESS') {
					replace(MY_CHABAP_TAB_FLOW, { screen: INQUIRY_LIST_SCREEN })
				}
			} catch (error) {
				console.log('boardInsert error => ', error)
			}
		}
	}

	async function getCommCodeList() {
		try {
			const response = await GET_COMM_CODE_SEARCH_LIST(codeDispatch, {
				code: INQUIRY_TYPE_CD,
			})
			const resData = response.data.data
			const codeitem = resData.map((item) => {
				return {
					codeName: item.codeName,
				}
			})
			setCommCodeList(codeitem)
			setIsOpen(!isOpen)
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<>
			{insertLoading && <Loading />}

			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={winHeight * 0.125}
			>
				<ScrollView
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					keyboardShouldPersistTaps={'always'}
					style={{ height: '93%', backgroundColor: theme.colors.background }}
				>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<Contents>
							<Selectcontent>
								<Select
									items={commList}
									value={codeValue}
									names={['codeName']}
									onValueChange={(item) => {
										setCodeValue(item.codeName)
										setCode({ value: item.code })
									}}
									setOpen={() => getCommCodeList()}
									isOpen={isOpen}
									title={'문의유형 선택'}
									placeholder={'문의유형'}
									leftIcon={
										<>
											{!codeValue && (
												<AwesomeStarSvg
													width={4}
													height={4}
													style={{ left: horizontalScale(8) }}
												/>
											)}
										</>
									}
									selectviewStyle={{ ...styles.selectView, ...theme.shadow() }}
									feedbackStyle={styles.selectFeedback}
									inputAndroidStyle={styles.selectinputAndroid}
									inputIosStyle={styles.selectinputIos}
									rightIconViewStyle={styles.selectrightIconView}
									placeholderStyle={styles.selectplaceholder}
									textStyle={{ fontSize: 15 }}
								></Select>
							</Selectcontent>

							<Bodycontent style={{ ...theme.shadow() }}>
								<StarView
									isValue={!!subject.value}
									containerStyle={{ marginLeft: horizontalScale(16) }}
								></StarView>
								<TextInput
									placeholderTextColor={theme.colors.darkGray}
									value={subject.value}
									style={styles.textInput}
									//autoFocus={true}
									onSubmitEditing={saveInquiry}
									onChangeText={(text) => setSubject({ value: text, error: '' })}
									placeholder="제목을 입력해 주세요."
								/>
							</Bodycontent>
							<Bodycontent style={{ ...theme.shadow() }}>
								<StarView
									isValue={!!content.value}
									containerStyle={{
										marginLeft: horizontalScale(16),
										top: 0,
										left: 0,
									}}
									starStyle={{ marginTop: verticalScale(28) }}
								></StarView>
								{!content.value && (
									<SmallText
										style={{
											position: 'absolute',
											top: 0,
											left: 0,
											color: theme.colors.darkGray,
											fontSize: moderateScale(16),
											zIndex: 1,
											marginLeft: horizontalScale(32),
											marginTop: verticalScale(20),
										}}
									>
										내용을 입력해주세요.
									</SmallText>
								)}
								<TextInput
									placeholderTextColor={theme.colors.lightGray}
									value={content.value}
									style={styles.bodyInput}
									multiline={true}
									onChangeText={(text) => setContent({ value: text, error: '' })}
									placeholder={
										'\n\n아래 내용을 작성/캡쳐해주시면 보다 정확한\n답변이 가능합니다.\n\n  - 휴대전화 모델명 : \n  - 안드로이드 버젼 : \n  - 앱 버젼 : \n  - 문의내용 : '
									}
								/>
							</Bodycontent>
							<Btncontent>
								<TouchableOpacity
									style={styles.imageButton}
									onPress={() => {
										ImagePicker.openPicker({
											width: 300,
											height: 400,
											cropping: true,
											multiple: true,
											mediaType: 'photo',
										}).then((image) => {
											const imageFormData = new FormData()
											let file = {
												uri: image.path,
												type: 'multipart/form-data',
												name: image.filename,
											}
											imageFormData.append('image', file)
											const newImageList = imageList.concat(image)
											if (image.length > 0) {
												// 파일용량 30메가 제한, 파일등록 3개까지 가능
												if (newImageList.length > 3) {
													$alert('사진은 3개까지 등록 가능합니다.')
													return
												}
												for (const i of image) {
													if (i.size > 31457280) {
														$alert('사진 용량은 30mb를 초과할 수 없습니다.')
														return
													}
												}
											}
											setImageList(newImageList)
										})
									}}
								>
									<CameraSvg
										flexDirection="row"
										width={moderateScale(16)}
										height={moderateScale(14)}
										marginRight={moderateScale(7)}
									/>
									<Paragraph style={styles.itemText}>첨부하기</Paragraph>
								</TouchableOpacity>
							</Btncontent>
							<ImgContent>
								{imageList.length > 0 ? (
									<View style={styles.imageView}>
										{imageList.map((image, index) => (
											<View key={index} style={styles.imageListView}>
												{/* <Text>{imageList[0]?.data}</Text> */}
												{/* <Image source={{ uri: `data:${imageList[0]?.mime};base64,${imageList[0]?.data}` }} /> */}
												<Image
													source={{
														// uri: `data:${image.mime};base64,${image.data}`,
														uri: `${image.path}`,
														width: 86,
														height: 80,
													}}
													style={styles.imageList}
												/>
												<TouchableOpacity
													onPress={() => removePhoto(index)}
													style={styles.cancelButton}
												>
													<CloseCircleSvg
														width={moderateScale(20)}
														height={moderateScale(20)}
													/>
												</TouchableOpacity>
											</View>
										))}
									</View>
								) : (
									<Paragraph></Paragraph>
								)}
							</ImgContent>

							<ImgTextcontent>
								<Row>
									<DotView />
									<Text style={styles.imgText}>
										{'이미지는 최대 20MB이내, 3개까지 첨부 가능합니다.'}
									</Text>
								</Row>
								<Row>
									<DotView />
									<Text style={styles.imgText}>{'파일형식은 jpg,jpeg,png 형식이 가능합니다.'}</Text>
								</Row>
							</ImgTextcontent>
							<Checkboxcontent>
								<Checkbox
									onPress={() => handlePressCheck(!check.firstCheck, 'firstCheck')}
									checked={check.firstCheck}
									checkStyle={styles.checked}
									uncheckStyle={styles.unChecked}
									label={<Text style={styles.checkboxText}>[필수] 개인정보 수집 및 이용 동의</Text>}
									customTrueImage={<TrueImg source={require('@assets/icons/check.png')} />}
								/>
							</Checkboxcontent>
							<Checkboxcontent>
								<Checkbox
									onPress={() => handlePressCheck(!check.secondCheck, 'secondCheck')}
									checked={check.secondCheck}
									checkStyle={styles.checked}
									uncheckStyle={styles.unChecked}
									label={
										<Text style={styles.checkboxText}>[필수] 개인정보 3자 제공 및 위탁에 동의</Text>
									}
									customTrueImage={<TrueImg source={require('@assets/icons/check.png')} />}
								/>
							</Checkboxcontent>
							<Noticecontent>
								<Row>
									<DotView />
									<Text style={styles.noticeText}>
										유의사항 : 사업안전 보호법에 따른 고객응대 근로자 보호조치에
									</Text>
								</Row>
								<Row>
									<EmptyView />
									<Text style={styles.noticeText}>
										의거하여 폭언, 욕설등이 포함된 내용은{' '}
										<Text style={styles.noticeTextRed}>상담이 제한</Text>될 수 있습니다.
									</Text>
								</Row>
							</Noticecontent>
						</Contents>
					</TouchableWithoutFeedback>
				</ScrollView>

				<Buttoncontent>
					<ConfirmButton
						onPress={saveInquiry}
						style={{
							marginBottom: verticalScale(40),
							backgroundColor:
								check.firstCheck && check.secondCheck && content.value && subject.value && code.value
									? theme.colors.turquoise
									: theme.colors.disabled,
						}}
					>
						<SmallText
							style={{
								color: theme.colors.white,
								fontSize: moderateScale(16),
								fontFamily: theme.fonts.spoqaHanSansNeo.bold,
							}}
						>
							등록하기
						</SmallText>
					</ConfirmButton>
				</Buttoncontent>
			</KeyboardAvoidingView>
		</>
	)
}

const styles = StyleSheet.create({
	selectView: {
		width: '100%',
		height: verticalScale(50),
		paddingLeft: horizontalScale(8),
		backgroundColor: theme.colors.white,
		// borderColor: theme.colors.white,
		// borderRadius: moderateScale(5),
	},
	selectFeedback: {
		height: '60%',
	},
	selectinputAndroid: {
		position: 'absolute',
		alignItems: 'center',
		paddingLeft: horizontalScale(32),
	},
	selectinputIos: {
		position: 'absolute',
		alignItems: 'center',
		paddingLeft: horizontalScale(32),
	},
	selectrightIconView: {
		marginRight: horizontalScale(16),
		justifyContent: 'flex-end',
	},
	selectplaceholder: {
		color: theme.colors.darkGray,
		fontSize: moderateScale(16),
		flexDirection: 'row',
	},
	textInput: {
		width: '90%',
		height: verticalScale(50),
		backgroundColor: theme.colors.white,
		paddingLeft: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		fontSize: moderateScale(16),
		borderColor: theme.colors.white,
		borderRadius: moderateScale(5),
	},
	bodyInput: {
		width: '90%',
		backgroundColor: theme.colors.white,
		height: verticalScale(260),
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		textAlignVertical: 'top',
		paddingLeft: moderateScale(16),
		borderColor: theme.colors.white,
		borderRadius: moderateScale(5),
		marginTop: verticalScale(12),
		marginBottom: verticalScale(12),
	},
	imageButton: {
		width: '100%',
		height: verticalScale(52),
		backgroundColor: '#f1f1f5',
		borderWidth: horizontalScale(1),
		borderColor: theme.colors.disabled,
		marginTop: moderateScale(16),
		shadowColor: theme.colors.white,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: moderateScale(5),
	},
	itemText: {
		fontSize: moderateScale(16),
		color: '#727272',
	},
	imgText: {
		fontSize: moderateScale(13),
		color: '#727272',
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	noticeText: {
		fontSize: moderateScale(13),
		color: '#727272',
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	noticeTextRed: {
		fontSize: moderateScale(12.5),
		color: 'red',
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	checked: {
		width: moderateScale(18),
		height: moderateScale(18),
		justifyContent: 'center',
		marginTop: moderateScale(1),
		borderRadius: moderateScale(9),
		borderWidth: moderateScale(1),
		borderColor: theme.colors.turquoise,
		tintColor: theme.colors.white,
		backgroundColor: theme.colors.turquoise,
	},
	unChecked: {
		width: moderateScale(18),
		height: moderateScale(18),
		justifyContent: 'center',
		backgroundColor: 'white',
		marginTop: moderateScale(1),
		borderRadius: moderateScale(9),
		borderWidth: moderateScale(1),
		borderColor: theme.colors.disabled,
	},
	checkboxText: {
		fontSize: moderateScale(14),
		color: '#191919',
		marginLeft: moderateScale(10),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	imageView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: verticalScale(113),
		backgroundColor: theme.colors.white,
		borderWidth: horizontalScale(1),
		borderColor: theme.colors.disabled,
		marginTop: moderateScale(8),
		marginBottom: moderateScale(8),
		padding: moderateScale(10),
	},
	imageListView: {
		margin: moderateScale(8),
	},
	imageList: {
		borderRadius: moderateScale(10),
	},
	cancelButton: {
		position: 'absolute',
		top: 5,
		left: 60,
	},
	shadow: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: {
					width: 0,
					height: verticalScale(0.1),
				},
				shadowOpacity: 0.2,
				shadowRadius: moderateScale(1),
			},
			android: {
				elevation: 1,
			},
		}),
	},
})
