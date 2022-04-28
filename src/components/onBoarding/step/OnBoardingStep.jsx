import React, { useRef } from 'react'
import styled from 'styled-components/native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { moderateScale, device, verticalScale, horizontalScale } from '@theme/scaling'
import { animatedStyles } from '@/utils/animations'
import { StyleSheet, Platform, Dimensions } from 'react-native'
import { theme } from '@/theme'
import Subtitle from '@/components/ui/text/Subtitle'
import Button from '@/components/ui/button/Button'
import SmallText from '@/components/ui/text/SmallText'

const win = Dimensions.get('window')
const deviceHeight = win.height

const Container = styled.View`
	background-color: ${theme.colors.background};
`

const Contents = styled.View`
	width: auto;
	align-items: center;
	justify-content: center;
	padding-top: ${verticalScale(deviceHeight / 16)}px;
`

const CardView = styled.View`
	align-items: center;
	justify-content: center;
	padding: ${moderateScale(10)}px;
`

const TextView = styled.View`
	padding: ${verticalScale(5)}px ${horizontalScale(38)}px ${verticalScale(10)}px ${horizontalScale(38)}px;
`

const SnapView = styled.View`
	padding-top: ${verticalScale(70)}px;
`

const BtnView = styled.View`
	flex: 1;
	width: 80%;
	align-items: center;
	justify-content: center;
	padding-top: 60px;
	padding-bottom: 40px;
`

let sliderWidth = device.width
let itemWidth = Math.round(sliderWidth * 1)

export default function OnBoardingStep({ carouselList, setCurrentTab, currentTab }) {
	const isCarousel = useRef(null)

	function _renderItem({ item, index }) {
		return (
			<CardView key={index}>
				<TextView>
					<Subtitle
						style={{
							...styles.textColor,
						}}
					>
						{item?.text}
					</Subtitle>
				</TextView>
				<TextView>
					<SmallText
						style={{
							color: theme.colors.text,
							fontSize: moderateScale(15),
							alignSelf: 'center',
							justifyContent: 'center',
						}}
					>
						{item?.subText}
					</SmallText>
				</TextView>
				<SnapView>
					<item.image />
				</SnapView>
			</CardView>
		)
	}

	return (
		<Container>
			<Contents>
				<Pagination
					dotsLength={carouselList.length}
					activeDotIndex={currentTab}
					carouselRef={isCarousel}
					dotColor={theme.colors.turquoise}
					inactiveDotColor={theme.colors.disabled}
					inactiveDotOpacity={1}
					inactiveDotScale={1}
					tappableDots={!!isCarousel}
				/>
				<Carousel
					ref={isCarousel}
					// layout="tinder"
					// layoutCardOffset={9}
					data={carouselList}
					renderItem={_renderItem}
					useScrollView={true}
					sliderWidth={sliderWidth}
					itemWidth={itemWidth}
					inactiveSlideShift={1}
					onSnapToItem={setCurrentTab}
					slideInterpolatedStyle={animatedStyles}
					enableMomentum={true}
					decelerationRate={0.9}
					inactiveSlideScale={1}
					inactiveSlideOpacity={0.9}
					activeSlideAlignment="center"
				/>

				<BtnView>
					<Button
						style={{
							width: '100%',
							height: 60,
							borderWidth: moderateScale(1),
							borderRadius: moderateScale(8),
							borderColor: theme.colors.turquoise,
						}}
						onPress={() => {
							setCurrentTab(currentTab + 1)
							if (currentTab >= 0 && currentTab <= 2) isCarousel.current.snapToNext()
						}}
					>
						<SmallText
							style={{
								color: theme.colors.white,
								fontFamily: theme.fonts.spoqaHanSansNeo.bold,
								fontSize: moderateScale(18),
							}}
						>
							다음
						</SmallText>
					</Button>
				</BtnView>
			</Contents>
		</Container>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.background,
		borderRadius: moderateScale(8),
		alignItems: 'center',
	},
	textColor: {
		color: theme.colors.text,
		fontWeight: Platform.OS === 'android' ? '100' : 'bold',
		fontSize: moderateScale(24),
	},
})
