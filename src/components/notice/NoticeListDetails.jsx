import React, { useCallback, useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import { useFocusEffect, useRoute } from '@react-navigation/core'
import { GET_BOARD_DETAIL } from '@/core/store/api/create/boardCreate'
import { useBoardContext } from '@/core/store/api/providers/BoardApiProvider'
import SmallText from '../ui/text/SmallText'
import moment from 'moment'

const Container = styled.View`
	flex: 1;
	padding-top: ${verticalScale(16)}px;
	padding-left: ${horizontalScale(16)}px;
	padding-right: ${horizontalScale(16)}px;
	background-color: ${theme.colors.background};
`
const Contents = styled.View`
	justify-content: center;
`

const TitleView = styled.View`
	border-bottom-width: ${moderateScale(1)}px;
	border-bottom-color: #dbdbdb;
`

const ContentView = styled.View`
	padding-top: ${verticalScale(16)}px;
`

export default function NoticeListDetails() {
	const {
		params: { id: id },
	} = useRoute()
	const { dispatch: noticeDispatch } = useBoardContext()
	const [noticeList, setNoticeList] = useState([])
	// const { data: detailData } = msgState.messageDetail
	// const detail = detailData?.data || initialState.data

	useFocusEffect(
		useCallback(() => {
			getNoticeListDetail()
		}, [id]),
	)
	useEffect(() => {
		//setAnimatedStart()
	}, [])
	async function getNoticeListDetail() {
		if (id) {
			try {
				console.log('api call => ', id)
				const response = await GET_BOARD_DETAIL(noticeDispatch, { id: id })
				const resData = response.data
				if (resData?.code === 'SUCCESS') {
					setNoticeList(resData.data)
				}
			} catch (error) {
				console.log(error)
			}
		}
	}
	return (
		<Container>
			<Contents>
				<TitleView>
					<View style={styles.ItemView}>
						<SmallText style={styles.Title}>{noticeList.subject}</SmallText>
						<SmallText style={styles.ViewText}>{moment(noticeList.regDate).format('YY.MM.DD')}</SmallText>
					</View>
				</TitleView>
				<ContentView>
					<View style={styles.ItemView}>
						<SmallText style={styles.Title}>{noticeList.content}</SmallText>
					</View>
				</ContentView>
			</Contents>
		</Container>
	)
}

const styles = StyleSheet.create({
	ViewText: {
		width: '100%',
		fontSize: moderateScale(14),
		color: theme.colors.darkGray,
		paddingTop: verticalScale(8),
		paddingBottom: verticalScale(16),
	},
	Title: {
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	ItemView: {
		paddingLeft: horizontalScale(8),
		paddingRight: horizontalScale(8),
	},
})
