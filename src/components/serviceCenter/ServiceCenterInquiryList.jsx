import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { Animated, Easing, StyleSheet, View, FlatList, Image } from 'react-native'
import styled from 'styled-components/native'
import { ArrowDownSvg, ArrowUpSvg, ExclamationGraySvg } from '@util/svgUtil'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { theme } from '@/theme'
import Left from '../ui/view/Left'
import Right from '../ui/view/Right'
import { useBoardContext } from '@/core/store/api/providers/BoardApiProvider'
import { GET_BOARD_PAGE_LIST } from '@/core/store/api/create/boardCreate'
import { ServiceCenterTypeCd } from '@/constants/boardConst'
import { useUser } from '@/core/store/common/providers/UserProvider'
import Scrolling from '../ui/Scrolling'
import Modal from '../ui/modal/Modal'
import SmallText from '@/components/ui/text/SmallText'

const Container = styled.View`
	flex: 1;
	padding: ${verticalScale(16)}px ${horizontalScale(24)}px;
`

const ItemView = styled.View`
	padding-bottom: ${verticalScale(10)}px;
`

const Pressable = styled.Pressable`
	margin-bottom: ${verticalScale(10)}px;
`
const PressableView = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`
const EemptyView = styled.View`
	flex: 0.9;
	align-items: center;
	justify-content: center;
`
const ImgContent = styled.View`
	margin-bottom: ${verticalScale(10)}px;
`
const ImageView = styled.TouchableOpacity``

const Feedback = styled.View`
	height: 30%;
`
const ModalContainer = styled.View`
	flex: 1;
	z-index: 1;
	border-radius: ${moderateScale(10)}px;
`
const ModalContentView = styled.View`
	align-items: center;
`

function ArrowDownImg() {
	return <ArrowDownSvg width={moderateScale(10)} height={moderateScale(6)} />
}

function ArrowUpImg() {
	return <ArrowUpSvg width={moderateScale(10)} height={moderateScale(6)} />
}

export default function ServiceCenterInquiryList() {
	const [accordionList, setAccordionList] = useState([])
	const [page, setPage] = useState(0)
	const [totalPages, setTotalPages] = useState(0)
	const { state: state, dispatch: dispatch } = useBoardContext()
	const { userState } = useUser()
	const { loading: boardPageList } = state.boardPageList
	const [openModal, setOpenModal] = useState(false)
	const [img, setImg] = useState('')

	useFocusEffect(
		useCallback(() => {
			//getInquiryList()
		}, []),
	)

	useEffect(() => {
		getInquiryList()
	}, [])

	async function getInquiryList() {
		try {
			if (page <= totalPages) {
				const response = await GET_BOARD_PAGE_LIST(dispatch, {
					boardCd: ServiceCenterTypeCd.INQUIRY,
					page: page,
					size: 10,
					sort: 'regDate,desc',
					userId: userState.id,
					isGroup: false,
				})
				const resData = response.data
				if (resData?.code === 'SUCCESS') {
					setPage(page + 1)
					setTotalPages(resData.data.totalPages)
					setAccordionList(
						accordionList.concat(resData.data.content).map((u) => {
							return { ...u, isOpen: false, animated: new Animated.Value(0) }
						}),
					)
					setAnimatedStart()
				}
			}
		} catch (err) {
			console.log(err)
		}
	}

	const setAnimatedStart = useCallback(() => {
		accordionList.forEach((acc) => {
			Animated.timing(acc.animated, {
				toValue: acc.isOpen ? 250 : 0,
				duration: 1000,
				easing: Easing.linear,
				useNativeDriver: true,
			}).start()
		})
	}, [accordionList])

	function handlePressAccordion(id) {
		setAccordionList(
			accordionList.map((a) => {
				if (a.id === id) {
					return { ...a, isOpen: !a.isOpen }
				}
				return { ...a }
			}),
		)
	}

	const moveToastToggle = (index) => {
		return accordionList[index].animated.interpolate({
			inputRange: [-25, 25],
			outputRange: [-25, 0],
			extrapolate: 'clamp',
		})
	}

	const animationStyles = (index) => {
		return [{ translateY: moveToastToggle(index) }]
	}

	function handlePressImage(image) {
		setImg(image)
		setOpenModal(true)
	}

	return (
		<Container>
			{accordionList.length > 0 ? (
				<FlatList
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					style={styles.flatList}
					data={accordionList}
					onEndReached={getInquiryList}
					renderItem={({ item, index }) => (
						<View>
							<ItemView>
								<View style={styles.ItemView}>
									<Pressable onPress={() => handlePressAccordion(item.id)}>
										<SmallText style={styles.textcodeName}>[{item.codeName}]</SmallText>
										<PressableView>
											<Left>
												<SmallText style={styles.paraText}>Q. {item.subject}</SmallText>
											</Left>
											<Right>{item.isOpen ? <ArrowUpImg /> : <ArrowDownImg />}</Right>
										</PressableView>
										<View style={styles.rowText}>
											{item.boardComments.length > 0 ? (
												<SmallText style={{ color: '#23c7d0', fontSize: 13 }}>
													답변완료
												</SmallText>
											) : (
												<SmallText style={styles.colorText}>답변대기</SmallText>
											)}

											<SmallText style={styles.colorTextMargin}> | </SmallText>
											<SmallText style={styles.colorText}>{item.regDate}</SmallText>
										</View>
									</Pressable>
								</View>
								{item.isOpen && (
									<Animated.View
										style={[
											{
												marginTop: moderateScale(14),
												borderBottomWidth: 1,
												borderColor: '#dbdbdb',
												borderStyle: 'solid',
												//paddingBottom: verticalScale(10),
												backgroundColor: 'white',
											},
											{ transform: animationStyles(index) },
										]}
										snapToOffsets={[0, 96]}
										keyboardDismissMode="interactive"
										scrollEventThrottle={16}
										directionalLockEnabled
										showsVerticalScrollIndicator={false}
										showsHorizontalScrollIndicator={false}
									>
										<View style={styles.animatedView}>
											<SmallText style={styles.Text}>문의내용</SmallText>
											<SmallText style={styles.paraText}>{item.content}</SmallText>
										</View>
										<ImgContent>
											{item.boardAttachments.length > 0 ? (
												<View>
													<SmallText
														style={{ marginLeft: 16, color: '#797979', fontSize: 14 }}
													>
														첨부파일
													</SmallText>
													<View style={styles.imageView}>
														{item.boardAttachments.map((image, index2) => (
															<ImageView
																key={index2}
																style={styles.imageListView}
																onPress={() => handlePressImage(image.fileurl)}
															>
																<Image
																	source={{
																		uri: `${image.fileurl}`,
																		width: 86,
																		height: 80,
																	}}
																	style={styles.imageList}
																/>
															</ImageView>
														))}
													</View>
													{openModal ? (
														<Modal.Common
															transparent={true}
															visible={openModal}
															animationType="fade"
															setClose={() => setOpenModal(false)}
														>
															<Feedback />
															<ModalContainer>
																<ModalContentView>
																	<Image
																		source={{
																			uri: `${img}`,
																			width: 312,
																			height: 312,
																		}}
																		style={styles.imageList}
																	/>
																</ModalContentView>
															</ModalContainer>
															<Feedback />
														</Modal.Common>
													) : null}
												</View>
											) : null}
										</ImgContent>
										{item.boardComments.length > 0 ? (
											<View>
												<View>
													{item.boardComments.map((comment, index3) => (
														<View style={styles.ItemViewTop} key={index3}>
															<View style={styles.commentView}>
																<SmallText
																	style={{
																		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
																		fontSize: 14,
																		marginRight: moderateScale(5),
																	}}
																>
																	A.
																</SmallText>
																<SmallText style={{ color: '#23c7d0' }}>
																	답변완료
																</SmallText>
															</View>
															<SmallText style={styles.textComment}>
																{comment.content}
															</SmallText>
														</View>
													))}
												</View>
											</View>
										) : (
											<View></View>
										)}
									</Animated.View>
								)}
							</ItemView>
						</View>
					)}
				/>
			) : (
				<EemptyView>
					<ExclamationGraySvg width={moderateScale(38)} height={moderateScale(38)} />
					<View style={{ margin: moderateScale(10) }} />
					<SmallText style={styles.emptyText}>문의하신 내역이 없습니다.</SmallText>
				</EemptyView>
			)}
			{boardPageList && accordionList.length > 0 && <Scrolling />}
		</Container>
	)
}

const styles = StyleSheet.create({
	emptyText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		fontSize: moderateScale(15),
		color: '#797979',
	},
	ItemView: {
		borderBottomWidth: 1,
		borderColor: '#dbdbdb',
		borderStyle: 'solid',
		height: moderateScale(98),
		paddingRight: moderateScale(8),
		paddingLeft: moderateScale(8),
	},
	ItemViewTop: {
		borderTopWidth: 1,
		borderColor: '#dbdbdb',
		borderStyle: 'solid',
		//height: moderateScale(98),
		padding: moderateScale(20),
	},
	commentView: {
		flexDirection: 'row',
	},
	flatList: {
		padding: verticalScale(10),
		flex: 1,
	},

	textcodeName: {
		fontSize: 14,
		marginBottom: verticalScale(10),
		marginTop: moderateScale(5),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	rowText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		marginTop: verticalScale(10),
		flexDirection: 'row',
		color: '#797979',
	},
	colorText: {
		color: '#797979',
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		fontSize: 13,
	},
	colorTextMargin: {
		color: '#797979',
		marginRight: moderateScale(5),
		marginLeft: moderateScale(5),
	},
	Text: {
		fontSize: 14,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		marginBottom: verticalScale(10),
		color: '#797979',
	},
	imageView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		margin: moderateScale(8),
		height: verticalScale(113),
		backgroundColor: theme.colors.white,
		borderWidth: horizontalScale(1),
		borderColor: theme.colors.disabled,
		padding: moderateScale(10),
	},
	imageListView: {
		margin: moderateScale(8),
	},
	imageList: {
		borderRadius: moderateScale(10),
	},
	textComment: {
		marginTop: moderateScale(10),
		fontSize: 16,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	paraText: {
		fontSize: 16,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	animatedView: {
		padding: moderateScale(16),
	},
})
