import Left from '@/components/ui/view/Left'
import { theme } from '@/theme'
import React, { memo, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import { moderateScale, verticalScale } from '@theme/scaling'
import SmallText from '@/components/ui/text/SmallText'
import { Dimensions, Platform } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { useDeviceOrientation } from '@react-native-community/hooks'
import ResponsiveImg from '@/components/ui/image/ResponsiveImg'

const Header = styled.View`
	flex-direction: row;
	justify-content: space-between;
	padding-bottom: ${verticalScale(8)}px;
`

const Contents = styled.View`
	width: 100%;
	align-items: center;
	justify-content: center;
`

const win = Dimensions.get('window')
const winWidth = win.width
const sliderWidth = winWidth - 32
const itemWidth = Math.round(sliderWidth * 1)

function MainChargeMethod() {
	const isCarousel = useRef(null)
	const [imageList, setImageList] = useState([])
	const { landscape } = useDeviceOrientation()

	useEffect(() => {
		if (!landscape) {
			setImageList(getImageList(300, 98))
		} else {
			setImageList(getImageList(400, 98))
		}
	}, [landscape])

	function getImageList(width, height) {
		return [
			{
				image: () => {
					return Platform.OS === 'ios' ? (
						<ResponsiveImg
							source={require('@assets/images/charge_method_1_ios.png')}
							width={width}
							height={height}
						/>
					) : (
						<ResponsiveImg
							source={require('@assets/images/charge_method_1_android.png')}
							width={width}
							height={height}
						/>
					)
				},
			},
			{
				image: () => {
					return Platform.OS === 'ios' ? (
						<ResponsiveImg
							source={require('@assets/images/charge_method_2_ios.png')}
							width={width}
							height={height}
						/>
					) : (
						<ResponsiveImg
							source={require('@assets/images/charge_method_2_android.png')}
							width={width}
							height={height}
						/>
					)
				},
			},
			{
				image: () => {
					return Platform.OS === 'ios' ? (
						<ResponsiveImg
							source={require('@assets/images/charge_method_3_ios.png')}
							width={width}
							height={height}
						/>
					) : (
						<ResponsiveImg
							source={require('@assets/images/charge_method_3_android.png')}
							width={width}
							height={height}
						/>
					)
				},
			},
			{
				image: () => {
					return Platform.OS === 'ios' ? (
						<ResponsiveImg
							source={require('@assets/images/charge_method_4_ios.png')}
							width={width}
							height={height}
						/>
					) : (
						<ResponsiveImg
							source={require('@assets/images/charge_method_4_android.png')}
							width={width}
							height={height}
						/>
					)
				},
			},
		]
	}

	function _renderItem({ item, index }) {
		return <item.image key={index} />
	}

	return (
		<>
			<Header>
				<Left>
					<SmallText style={{ fontSize: moderateScale(16), fontFamily: theme.fonts.spoqaHanSansNeo.bold }}>
						충전 방법
					</SmallText>
				</Left>
			</Header>
			<Contents>
				<Carousel
					ref={isCarousel}
					data={imageList}
					renderItem={_renderItem}
					useScrollView={true}
					sliderWidth={sliderWidth}
					itemWidth={itemWidth}
					autoplay
					autoplayDelay={1000}
					enableMomentum={true}
					decelerationRate={0.9}
					inactiveSlideScale={0.9}
					inactiveSlideOpacity={0.1}
					activeSlideAlignment="center"
					loop={true}
				/>
			</Contents>
		</>
	)
}

export default memo(MainChargeMethod)
