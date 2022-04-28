import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import { useFocusEffect, useRoute } from '@react-navigation/core'
import { GET_MESSAGE_DETAIL } from '@/core/store/api/create/messageCreate'
import { initialMessageDetailState, useMessageContext } from '@/core/store/api/providers/MessageApiProvider'
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

export default function NoticeAlarmDetails() {
	const {
		params: { id: messageId },
	} = useRoute()
	const { state: msgState, dispatch: msgDispatch } = useMessageContext()
	const { data: detailData } = msgState.messageDetail
	const detail = detailData?.data || initialMessageDetailState.data

	useFocusEffect(
		useCallback(() => {
			getMessageDetail()
		}, [messageId]),
	)

	async function getMessageDetail() {
		if (messageId) {
			try {
				await GET_MESSAGE_DETAIL(msgDispatch, { id: messageId })
			} catch (error) {
				console.log('message detail error => ', error)
			}
		}
	}

	return (
		<Container>
			<Contents>
				<TitleView>
					<View style={styles.ItemView}>
						<SmallText style={styles.Title}>{detail.subject}</SmallText>
						<SmallText style={styles.ViewText}>{moment(detail.sendDate).format('YY.MM.DD')}</SmallText>
					</View>
				</TitleView>
				<ContentView>
					<View style={styles.ItemView}>
						<SmallText style={{ lineHeight: moderateScale(24), fontSize: moderateScale(16) }}>
							{detail.content}
						</SmallText>
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
		width: '100%',
		fontSize: moderateScale(16),
	},
	ItemView: {
		paddingLeft: horizontalScale(8),
		paddingRight: horizontalScale(8),
	},
})
