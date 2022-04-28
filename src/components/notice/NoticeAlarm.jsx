import React, { useCallback, useState } from 'react'
import Paragraph from '@/components/ui/text/Paragraph'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import constants from '@/navigations/constants'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { theme } from '@/theme'
import styled from 'styled-components/native'
import { verticalScale, moderateScale, horizontalScale } from '@theme/scaling'
import { useUser } from '@/core/store/common/providers/UserProvider'
import { GET_MESSAGE_LIST, PATCH_READ_VALUE } from '@/core/store/api/create/messageCreate'
import { useMessageContext } from '@/core/store/api/providers/MessageApiProvider'
import Loading from '../ui/Loading'
import { ExclamationGraySvg, NewSvg } from '@util/svgUtil'
import moment from 'moment'
import SmallText from '../ui/text/SmallText'
import Scrolling from '../ui/Scrolling'

const { MY_CHABAP_TAB_FLOW, NOTICE_ALARM_DETAILS_SCREEN } = constants

const Container = styled.View`
	flex: 1;
	padding-top: ${verticalScale(16)}px;
	padding-left: ${horizontalScale(16)}px;
	padding-right: ${horizontalScale(16)}px;
	background-color: ${theme.colors.background};
`

const EmptyData = styled.View`
	height: 100%;
	justify-content: center;
	align-items: center;
`

const ItemView = styled.View`
	border-bottom-width: ${moderateScale(1)}px;
	border-bottom-color: #dbdbdb;
`

const Pressable = styled.Pressable`
	padding-top: ${moderateScale(16)}px;
	padding-right: ${horizontalScale(8)}px;
	padding-left: ${horizontalScale(8)}px;
`

const TitleVeiw = styled.View`
	flex-direction: row;
	align-items: center;
`

const DateView = styled.View``

export default function NoticeAlarm() {
	const { navigate } = useNavigation()
	const {
		userState: { isLoggined },
	} = useUser()
	const [pageData, setPageData] = useState({ page: 0, size: 20, sort: 'sendDate,desc' })
	const [msgList, setMsgList] = useState([])
	const [isFull, setIsFull] = useState(false)
	const { state: msgState, dispatch: msgDispatch } = useMessageContext()
	const { loading: msgListLoading } = msgState.messageList
	const { loading: readLoading } = msgState.readValue

	useFocusEffect(
		useCallback(() => {
			getMessageList()
		}, [isLoggined]),
	)

	async function getMessageList() {
		if (isLoggined) {
			try {
				const response = await GET_MESSAGE_LIST(msgDispatch, { ...pageData })
				const resData = response.data

				if (resData?.code === 'SUCCESS' && resData?.data) {
					const elements = resData.data.totalElements
					const contents = resData.data.content

					if (elements === msgList.length) {
						setIsFull(true)
					} else {
						setMsgList([...msgList, ...contents])
						setPageData({
							...pageData,
							page: pageData.page + 1,
						})
						setIsFull(false)
					}
				}
			} catch (error) {
				console.log('message list error => ', error)
			}
		}
	}

	async function patchReadValue(id) {
		if (isLoggined) {
			try {
				const response = await PATCH_READ_VALUE(msgDispatch, { id })
				const resData = response.data
				if (resData?.data === true) {
					navigate(MY_CHABAP_TAB_FLOW, { screen: NOTICE_ALARM_DETAILS_SCREEN, params: { id } })
				} else {
					console.log(resData.msg)
				}
			} catch (error) {
				console.log('patch read value error => ', error)
			}
		}
	}

	function handleLeadMore() {
		if (!isFull) {
			getMessageList()
		}
	}

	return (
		<>
			{readLoading && <Loading />}
			<Container>
				<FlatList
					data={msgList}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<ItemView>
							<Pressable onPress={() => patchReadValue(item.id)}>
								<TitleVeiw>
									<Paragraph style={styles.ViewParagraph}>
										{item.subject.length > 24
											? item.subject.substring(0, 24) + '...'
											: item.subject}
									</Paragraph>
									{item.readFlag === 'N' && (
										<NewSvg width={moderateScale(32)} height={moderateScale(32)} />
									)}
								</TitleVeiw>
								<DateView>
									<Text style={styles.ViewText}>{moment(item.sendDate).format('YY.MM.DD')}</Text>
								</DateView>
							</Pressable>
						</ItemView>
					)}
					onEndReached={() => handleLeadMore()}
					onEndReachedThreshold={0.6}
					refreshing={true}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
				/>
				{msgList.length === 0 && (
					<EmptyData>
						<ExclamationGraySvg width={moderateScale(38)} height={moderateScale(38)} />
						<View style={{ margin: moderateScale(10) }} />
						<SmallText style={styles.emptyText}>알림 내역이 없습니다.</SmallText>
					</EmptyData>
				)}
				{msgListLoading && msgList.length > 0 && <Scrolling />}
			</Container>
		</>
	)
}

const styles = StyleSheet.create({
	ViewText: {
		fontSize: moderateScale(14),
		color: theme.colors.darkGray,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		paddingTop: verticalScale(8),
		paddingBottom: verticalScale(16),
	},
	ViewParagraph: {
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	emptyText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		fontSize: moderateScale(18),
		color: theme.colors.darkGray,
	},
})
