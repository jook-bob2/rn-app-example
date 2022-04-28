import Paragraph from '@/components/ui/text/Paragraph'
import React, { useRef } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import constants from '@/navigations/constants'
import { useNavigation } from '@react-navigation/core'
import { theme } from '@/theme'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import styled from 'styled-components/native'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'

const { MY_CHABAP_TAB_FLOW, NOTICE_EVENT_SCREEN } = constants

const Container = styled.ScrollView`
	padding: ${moderateScale(10)}px;
`
const Contents = styled.View`
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
`
const ItemView = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
`
const Image = styled.Image`
	width: ${moderateScale(18)}px;
	height: ${moderateScale(18)}px;
`
const ImageView = styled.View`
	padding: ${verticalScale(3)}px ${horizontalScale(10)}px ${verticalScale(3)}px ${horizontalScale(5)}px;
`

export default function ListPartEventList() {
	const { navigate } = useNavigation()
	const scrollX = useRef(new Animated.Value(0)).current

	return (
		<Container>
			<Contents>
				<ItemView style={styles.TopItemView}>
					<Left>
						<Paragraph style={styles.Paragraph}>이벤트</Paragraph>
					</Left>
					<Right>
						<TouchableOpacity
							style={styles.Button}
							onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: NOTICE_EVENT_SCREEN })}
						>
							<Text style={styles.Text}>더보기</Text>
							<Image
								style={styles.ImagePointor}
								tintColor={theme.colors.darkGray}
								source={require('@assets/icons/pointor_right.png')}
							/>
						</TouchableOpacity>
					</Right>
				</ItemView>
			</Contents>
			<Animated.ScrollView
				style={styles.animatedView}
				horizontal
				// pagingEnabled
				snapToOffsets={[0, 96]}
				snapToEnd={false}
				onScroll={Animated.event(
					[
						{
							nativeEvent: {
								contentOffset: {
									x: scrollX,
								},
							},
						},
					],
					{
						useNativeDriver: true,
					},
				)}
				keyboardDismissMode="interactive"
				scrollEventThrottle={16}
				directionalLockEnabled
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
			>
				<Contents style={styles.contents}>
					<View style={styles.ViewRow}>
						<TouchableOpacity onPress={() => {}} style={styles.TouchableOpacity}>
							<Image
								style={styles.TouchableOpacityImage}
								source={require('@/assets/images/blank_vertical.png')}
							/>
						</TouchableOpacity>
						<ItemView style={styles.BottomItemView}>
							<Left>
								<Text style={styles.ScrollViewText}>이벤트 제목 노출 영역</Text>
							</Left>
							<Right>
								<ImageView>
									<Text style={styles.BottomITextDate}>21.11.15</Text>
								</ImageView>
							</Right>
						</ItemView>
						<Text style={styles.BottomIText}>
							섭타이틀이 최대2주로 노출됩니다. 섭타이틀이 최대2주로 노출됩니다....
						</Text>
					</View>
					<View style={styles.ViewRow}>
						<TouchableOpacity onPress={() => {}} style={styles.TouchableOpacity}>
							<Image
								style={styles.TouchableOpacityImage}
								source={require('@/assets/images/blank_vertical.png')}
							/>
						</TouchableOpacity>
						<ItemView style={styles.BottomItemView}>
							<Left>
								<Text style={styles.ScrollViewText}>이벤트 제목 노출 영역</Text>
							</Left>
							<Right>
								<ImageView>
									<Text style={styles.BottomITextDate}>21.11.15</Text>
								</ImageView>
							</Right>
						</ItemView>
						<Text style={styles.BottomIText}>
							섭타이틀이 최대2주로 노출됩니다. 섭타이틀이 최대2주로 노출됩니다....
						</Text>
					</View>
					<View style={styles.ViewRow}>
						<TouchableOpacity onPress={() => {}} style={styles.TouchableOpacity}>
							<Image
								style={styles.TouchableOpacityImage}
								source={require('@/assets/images/blank_vertical.png')}
							/>
						</TouchableOpacity>
						<ItemView style={styles.BottomItemView}>
							<Left>
								<Text style={styles.ScrollViewText}>이벤트 제목 노출 영역</Text>
							</Left>
							<Right>
								<ImageView>
									<Text style={styles.BottomITextDate}>21.11.15</Text>
								</ImageView>
							</Right>
						</ItemView>
						<Text style={styles.BottomIText}>
							섭타이틀이 최대2주로 노출됩니다. 섭타이틀이 최대2주로 노출됩니다....
						</Text>
					</View>
				</Contents>
			</Animated.ScrollView>
		</Container>
	)
}

const styles = StyleSheet.create({
	Paragraph: {
		marginLeft: horizontalScale(20),
		fontSize: 14,
		color: theme.colors.darkGray,
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	Button: {
		width: moderateScale(93),
		height: moderateScale(23),
		marginRight: horizontalScale(10),
		marginBottom: verticalScale(10),
		borderRadius: 25,
		paddingTop: moderateScale(2),
		backgroundColor: theme.colors.turquoise,
		flexDirection: 'row',
		shadowColor: '#000',
		shadowOffset: {
			width: moderateScale(1.2),
			height: moderateScale(4),
		},
		shadowOpacity: 0.2,
		shadowRadius: moderateScale(1.2),
		elevation: 5,
	},
	Text: {
		fontSize: 12,
		lineHeight: horizontalScale(15),
		color: 'white',
		flex: 1,
		marginLeft: horizontalScale(10),
		alignSelf: 'center',
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	BottomIText: {
		alignSelf: 'flex-start',
		marginLeft: horizontalScale(10),
		maxWidth: verticalScale(215),
		fontSize: 12,
		color: '#727272',
	},
	BottomITextDate: {
		marginRight: moderateScale(5),
		maxWidth: verticalScale(220),
		fontSize: 12,
		color: '#727272',
	},
	ImagePointor: {
		marginRight: horizontalScale(10),
		marginTop: moderateScale(1),
	},
	ViewText: {
		width: moderateScale(330),
		alignItems: 'center',
		justifyContent: 'center',
		color: '#CFCDCD',
	},
	ItemView: {
		flexDirection: 'row',
	},
	TouchableOpacity: {
		width: moderateScale(230),
		height: moderateScale(111),
		backgroundColor: '#CFCDCD',
		borderBottomWidth: horizontalScale(1),
		borderBottomColor: theme.colors.disabled,
		borderRadius: 15,
		marginLeft: moderateScale(1),
		marginBottom: moderateScale(5),
	},
	TouchableOpacityImage: {
		width: moderateScale(226),
		height: moderateScale(106),
		borderBottomWidth: horizontalScale(1),
		borderRadius: 15,
		margin: moderateScale(2),
		alignSelf: 'flex-start',
	},
	ScrollViewText: {
		fontSize: 13.5,
		marginLeft: moderateScale(5),
		color: '#727272',
	},
	center: {
		alignItems: 'center',
	},
	contents: {
		width: '100%',
		backgroundColor: theme.colors.white,
		padding: moderateScale(10),
		marginLeft: moderateScale(5),
		paddingTop: 1,
	},
	ViewRow: {
		width: moderateScale(240),
		marginBottom: moderateScale(-10),
	},
	BottomItemView: {
		alignItems: 'center',
	},
	TopItemView: {
		marginTop: moderateScale(10),
	},
})
