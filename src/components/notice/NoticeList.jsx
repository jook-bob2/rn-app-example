import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { Animated, Easing, StyleSheet, View, FlatList } from 'react-native'
import SmallText from '@/components/ui/text/SmallText'
import styled from 'styled-components/native'
import { horizontalScale, moderateScale } from '@/theme/scaling'
import Paragraph from '@/components/ui/text/Paragraph'
import { useBoardContext } from '@/core/store/api/providers/BoardApiProvider'
import { GET_BOARD_PAGE_LIST } from '@/core/store/api/create/boardCreate'
import { NoticeTypeCd } from '@/constants/boardConst'
import { theme } from '@/theme'
import { NewSvg } from '@util/svgUtil'
import constants from '@/navigations/constants'
import Scrolling from '@/components/ui/Scrolling'

const { MY_CHABAP_TAB_FLOW, NOTICE_LIST_DETAILS_SCREEN } = constants

const Container = styled.View`
	flex: 1;
	background-color: ${theme.colors.background};
	padding-left: ${horizontalScale(16)}px;
	padding-right: ${horizontalScale(16)}px;
`

const Pressable = styled.Pressable``

export default function NoticeList() {
	const { navigate } = useNavigation()
	const [accordionList, setAccordionList] = useState([])
	const [page, setPage] = useState(0)
	const [totalPages, setTotalPages] = useState(0)
	const { state: state, dispatch: dispatch } = useBoardContext()
	const { loading: boardPageList } = state.boardPageList

	useFocusEffect(
		useCallback(() => {
			//getAlarmList()
		}, []),
	)

	useEffect(() => {
		getAlarmList()
	}, [])

	async function getAlarmList() {
		try {
			if (page <= totalPages) {
				const response = await GET_BOARD_PAGE_LIST(dispatch, {
					boardCd: NoticeTypeCd.NOTICE,
					page: page,
					size: 30,
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
	async function NoticeDetailsValue(id) {
		try {
			navigate(MY_CHABAP_TAB_FLOW, { screen: NOTICE_LIST_DETAILS_SCREEN, params: { id } })
		} catch (error) {
			console.log('error', error)
		}
	}
	return (
		<Container>
			<FlatList
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				style={styles.flatList}
				data={accordionList}
				onEndReached={getAlarmList}
				renderItem={({ item }) => (
					<View key={item.id} style={styles.touchableOpacity} onPress={() => handlePressAccordion(item.id)}>
						<Pressable key={item.id} onPress={() => NoticeDetailsValue(item.id)}>
							<View style={styles.textView}>
								<Paragraph style={styles.paraText}>
									{item.subject.length > 24 ? item.subject.substring(0, 24) + '...' : item.subject}
								</Paragraph>

								{item.readFlag === 'N' && (
									<NewSvg width={moderateScale(32)} height={moderateScale(32)} />
								)}
							</View>
							<View>
								<SmallText style={styles.regDate}>{item.regDate}</SmallText>
							</View>
						</Pressable>
					</View>
				)}
			/>
			{boardPageList && accordionList.length > 0 && <Scrolling />}
		</Container>
	)
}

const styles = StyleSheet.create({
	paraText: {
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		marginBottom: moderateScale(7),
	},
	textView: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	regDate: {
		fontSize: moderateScale(14),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		color: theme.colors.darkGray,
	},
	touchableOpacity: {
		width: '100%',
		paddingTop: moderateScale(16),
		paddingBottom: moderateScale(16),
		borderBottomWidth: moderateScale(1),
		paddingLeft: horizontalScale(8),
		paddingRight: horizontalScale(8),
		borderColor: '#dbdbdb',
		borderStyle: 'solid',
	},
})
