import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Platform } from 'react-native'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import styled from 'styled-components/native'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import Scrolling from '@/components/ui/Scrolling'
import ResponsiveImg from '@/components/ui/image/ResponsiveImg'
import { usePromotionContext } from '@/core/store/api/providers/PromotionApiProvider'
import { GET_PROMOTION_LIST_PAGE } from '@/core/store/api/create/promotionCreate'
import moment from 'moment'

const Container = styled.View`
	flex: 1;
`
const ItemView = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
`

const ImageView = styled.View`
	padding: ${verticalScale(3)}px ${horizontalScale(10)}px ${verticalScale(3)}px ${horizontalScale(5)}px;
`

export default function NoticeEvent() {
	const { state: promotionState, dispatch: promotionDispatch } = usePromotionContext()
	const [eventList, seteventList] = useState([])
	const [page, setPage] = useState(0)
	const [totalPages, setTotalPages] = useState(0)
	const { loading: promotionLoading } = promotionState.promotionList

	useEffect(() => {
		getEventList()
	}, [])

	async function getEventList() {
		try {
			if (page <= totalPages) {
				const response = await GET_PROMOTION_LIST_PAGE(promotionDispatch, {
					page: page,
					size: 10,
					platform: Platform.OS,
					filepath: 'event/',
					isEnd: false,
				})

				const resData = response.data
				if (resData?.code === 'SUCCESS') {
					setPage(page + 1)
					setTotalPages(resData.data.totalPages)
					seteventList(
						eventList.concat(resData.data.content).map((u) => {
							return { ...u }
						}),
					)
				}
			}
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<Container style={styles.contents}>
			<FlatList
				data={eventList}
				onEndReached={getEventList}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => {}} style={styles.touchableOpacity}>
						<View style={{ marginBottom: 16 }}>
							<View>
								<View style={styles.imageView}>
									{Platform.OS === 'ios' ? (
										<ResponsiveImg
											source={{
												uri: `${item.fileurl}`,
											}}
											width={345}
											height={208}
										/>
									) : (
										<ResponsiveImg
											source={{
												uri: `${item.fileurl}`,
											}}
											width={360}
											height={200}
										/>
									)}
								</View>
							</View>

							<ItemView style={styles.bottomItemView}>
								<Left>
									<Text style={styles.scrollViewText}>{item.subject}</Text>
								</Left>
								<Right>
									<ImageView>
										<Text style={styles.bottomITextDate}>
											{moment(item.regDate).format('YY.MM.DD')}
										</Text>
									</ImageView>
								</Right>
							</ItemView>
							<Text style={styles.bottomIText}>{item.content}</Text>
						</View>
					</TouchableOpacity>
				)}
			/>
			{promotionLoading && eventList.length > 0 && <Scrolling />}
		</Container>
	)
}

const styles = StyleSheet.create({
	bottomIText: {
		marginLeft: horizontalScale(5),
		fontSize: 14,
		color: '#727272',
	},
	bottomITextDate: {
		fontSize: 15,
		color: '#727272',
	},
	itemView: {
		flexDirection: 'row',
	},
	touchableOpacity: {
		marginBottom: moderateScale(5),
	},
	touchableOpacityImage: {
		borderRadius: 5,
		marginLeft: moderateScale(4),
		marginTop: moderateScale(2),
	},

	scrollViewText: {
		fontSize: 15.5,
		marginLeft: moderateScale(5),
		color: '#727272',
	},
	contents: {
		backgroundColor: '#f8f8fa',
	},
	imageView: {
		marginBottom: 10,
	},
})
