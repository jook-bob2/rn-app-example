import SearchInput from '@/components/ui/input/SearchInput'
import { ServiceCenterTypeCd } from '@/constants/boardConst'
import { GET_BOARD_PAGE_LIST } from '@/core/store/api/create/boardCreate'
import { useBoardContext } from '@/core/store/api/providers/BoardApiProvider'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { useFocusEffect } from '@react-navigation/core'
import React, { useCallback, useEffect, useState } from 'react'
import {
	Animated,
	Easing,
	StyleSheet,
	View,
	KeyboardAvoidingView,
	Platform,
	TextInput,
	FlatList,
	Keyboard,
	Dimensions,
} from 'react-native'
import styled from 'styled-components/native'
import Left from '../ui/view/Left'
import Right from '../ui/view/Right'
import { ArrowDownSvg, ArrowUpSvg } from '@util/svgUtil'
import Select from '../ui/select/Select'
import { useCommCodeContext } from '@/core/store/api/providers/CommCodeApiProvider'
import { GET_COMM_CODE_SEARCH_LIST } from '@/core/store/api/create/commCodeCreate'
import commCodeConst from '@/constants/commCodeConst'
import Scrolling from '@/components/ui/Scrolling'
import SmallText from '@/components/ui/text/SmallText'

const { INQUIRY_TYPE_CD } = commCodeConst

const Container = styled.View`
	flex: 1;
	flex-direction: column;
	justify-content: flex-end;
	height: ${verticalScale(100)}%;
	background-color: #f8f8fa;
`

const Wrap = styled.View`
	padding: ${verticalScale(16)}px ${horizontalScale(24)}px;
	flex: 1;
`

const ItemView = styled.View``

const Pressable = styled.Pressable`
	padding: ${verticalScale(20)}px ${horizontalScale(24)}px;
	background-color: ${theme.colors.white};
	border-color: ${theme.colors.background};
	border-radius: ${moderateScale(5)}px;
`
const PressableView = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`

const PressableInput = styled.Pressable`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: ${verticalScale(44)}px;
	background-color: ${theme.colors.white};
	border-width: ${moderateScale(1)}px;
	border-color: ${theme.colors.disabled};
	border-radius: ${moderateScale(5)}px;
`
const PressableSelect = styled.Pressable`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: ${verticalScale(44)}px;
	width: ${moderateScale(120)}px;
	margin-right: ${moderateScale(16)}px;
	background-color: ${theme.colors.white};
	border-width: ${moderateScale(1)}px;
	border-color: ${theme.colors.disabled};
	border-radius: ${moderateScale(5)}px;
`

const FooterView = styled.View`
	flex-direction: row;
	justify-content: center;
	padding: ${verticalScale(26)}px ${horizontalScale(20)}px;
	background-color: ${theme.colors.white};
	border-radius: ${moderateScale(20)}px;
`
const Footer = styled.View`
	flex: 0.19;
	justify-content: flex-end;
`

const winHeight = Dimensions.get('window').height

function ArrowDownImg() {
	return <ArrowDownSvg width={moderateScale(10)} height={verticalScale(6)} />
}

function ArrowUpImg() {
	return <ArrowUpSvg width={moderateScale(10)} height={verticalScale(6)} />
}

export default function ServiceCenterFAQ() {
	const [accordionList, setAccordionList] = useState([])
	const [keyword, setKeyword] = useState({ value: '' })
	const { state: boardState, dispatch: dispatch } = useBoardContext()
	const { dispatch: codedispatch } = useCommCodeContext()
	//const [commCodeList, setcommCodeList] = useState([])
	//const { data: commListData } = codestate.commCodeSearchList
	//const commList = commListData?.data || []
	const [isOpen, setIsOpen] = useState(false)
	const [codeValue, setCodeValue] = useState('')
	const [code, setCode] = useState('')
	const [page, setPage] = useState(0)
	const { loading: faqLoading } = boardState.boardPageList
	const [isFull, setIsFull] = useState(false)
	const [allList] = useState([
		{
			code: '',
			codeName: '전체',
			id: 0,
		},
	])
	const [allcommList, setAllCommList] = useState([])

	useFocusEffect(
		useCallback(() => {
			setKeyword({ value: '' })
			//setcommCodeList()
			setCodeValue(allList[0].codeName)
			setCode(allList[0].code)
			getFaqList(0)
			//setAllCommList()
		}, []),
	)

	useEffect(() => {
		setKeyword({ keyword })
		getFaqList(page)
		setAnimatedStart()
		//setAllCommList()
	}, [])

	async function getFaqList(searchPage) {
		try {
			const response = await GET_BOARD_PAGE_LIST(dispatch, {
				boardCd: ServiceCenterTypeCd.FAQ,
				keyword: keyword.value,
				page: searchPage,
				categoryCd: code,
				size: 20,
				isGroup: false,
			})
			const resData = response.data
			if (resData?.code === 'SUCCESS' && resData?.data) {
				const data = resData.data
				const contents = data.content
				const elements = data.totalElements
				if (searchPage === 0) {
					setAccordionList(
						contents.map((u) => {
							return { ...u, isOpen: false, animated: new Animated.Value(0) }
						}),
					)
					setPage(searchPage + 1)
					setIsFull(false)
				} else if (contents.length > 0) {
					setAccordionList(
						accordionList.concat(contents).map((u) => {
							return { ...u, isOpen: false, animated: new Animated.Value(0) }
						}),
					)
					setPage(searchPage + 1)
					setIsFull(false)
				} else if (elements === accordionList.length) {
					setIsFull(true)
				}
			}
		} catch (error) {
			console.log('faq list error => ', error)
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

	async function getCommCodeList() {
		try {
			const response = await GET_COMM_CODE_SEARCH_LIST(codedispatch, {
				code: INQUIRY_TYPE_CD,
			})
			const resData = response.data.data
			const codeitem = resData.map((item) => {
				return {
					code: item.code,
					codeName: item.codeName,
					id: item.id,
				}
			})
			setAllCommList(allList.concat(codeitem))
			setIsOpen(!isOpen)
		} catch (e) {
			console.log(e)
		}
	}

	function handleLeadMore() {
		if (!isFull) {
			getFaqList(page)
		}
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={winHeight * 0.15}
		>
			<Container>
				<Wrap>
					<FlatList
						data={accordionList}
						onEndReached={() => handleLeadMore()}
						onEndReachedThreshold={0.6}
						refreshing={true}
						nestedScrollEnabled={true}
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
						onScroll={Keyboard.dismiss}
						keyExtractor={(item) => item.id}
						renderItem={({ item, index }) => (
							<View style={{ marginBottom: 8 }} key={index}>
								<ItemView>
									<Pressable onPress={() => handlePressAccordion(item.id)}>
										<SmallText style={styles.codeNameText}>[{item.codeName}]</SmallText>
										<PressableView>
											<Left>
												<SmallText style={styles.subjectText}>Q. {item.subject}</SmallText>
											</Left>
											<Right>{item.isOpen ? <ArrowUpImg /> : <ArrowDownImg />}</Right>
										</PressableView>
									</Pressable>
									{item.isOpen && (
										<>
											<Animated.ScrollView
												style={[
													[
														{
															backgroundColor: theme.colors.white,
															padding: moderateScale(25),
															paddingTop: 16,
															marginTop: 10,
															borderTopWidth: moderateScale(1),
															borderTopColor: theme.colors.line,
															borderRadius: 5,
														},
														{ transform: animationStyles(index) },
													],
												]}
												nestedScrollEnabled={true}
												snapToEnd={false}
												keyboardDismissMode="interactive"
												//scrollEventThrottle={16}
												directionalLockEnabled
												showsVerticalScrollIndicator={false}
												showsHorizontalScrollIndicator={false}
											>
												<SmallText style={styles.paraText}>{item.content}</SmallText>
											</Animated.ScrollView>
										</>
									)}
								</ItemView>
							</View>
						)}
					/>
				</Wrap>
				{faqLoading && accordionList.length > 0 && <Scrolling />}
				<Footer>
					<FooterView style={styles.footer}>
						<PressableSelect>
							<Left>
								<Select
									items={allcommList}
									value={codeValue}
									names={['codeName']}
									onValueChange={(item) => {
										setCodeValue(item.codeName)
										setCode(item.code)
									}}
									setOpen={() => getCommCodeList()}
									isOpen={isOpen}
									title={'유형 선택'}
									//placeholder={'선택하세요'}
									selectviewStyle={styles.selectView}
									feedbackStyle={styles.selectFeedback}
									inputAndroidStyle={styles.selectinputAndroid}
									inputIosStyle={styles.selectinputIos}
									rightIconViewStyle={styles.selectrightIconView}
									placeholderStyle={styles.selectplaceholder}
								></Select>
							</Left>
						</PressableSelect>

						<PressableInput style={{ aspectRatio: 194 / 44 }}>
							<Left style={{ width: '70%' }}>
								<TextInput
									style={{ width: '100%', marginHorizontal: 8 }}
									value={keyword.value}
									onChangeText={(text) => setKeyword({ value: text })}
									placeholder="검색어를 입력하세요."
									returnKeyType="done"
									onSubmitEditing={() => getFaqList(0)}
								/>
							</Left>
							<Right>
								<SearchInput pressIcon={() => getFaqList(0)} style={styles.searchInput} />
							</Right>
						</PressableInput>
					</FooterView>
				</Footer>
			</Container>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	subjectText: {
		fontSize: 16,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		marginRight: moderateScale(25),
	},
	paraText: {
		color: theme.colors.text,
		fontSize: 16,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	searchInput: {
		marginRight: moderateScale(16.5),
	},
	selectView: {
		borderColor: theme.colors.white,
		backgroundColor: theme.colors.white,
		width: moderateScale(100),
		marginLeft: moderateScale(10),
		fontSize: moderateScale(14),
	},
	selectplaceholder: {
		color: theme.colors.darkGray,
		fontSize: 14,
	},
	selectFeedback: {
		height: '60%',
	},
	subjectView: {
		flexDirection: 'row',
	},
	codeNameText: {
		fontSize: 14,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		marginBottom: moderateScale(10),
	},
	footer: {
		borderTopStartRadius: 20,
		borderTopEndRadius: 20,
		borderBottomStartRadius: 0,
		borderBottomEndRadius: 0,
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
			android: {
				elevation: 8,
			},
		}),
	},
})
