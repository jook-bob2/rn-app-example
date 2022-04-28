import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { ArrowNextStepSvg, CloseStepSvg } from '@/utils/svgUtil'
import React, { useRef, useState } from 'react'
import { Dimensions, Modal, Platform, Pressable, StatusBar } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import styled from 'styled-components/native'
import ResponsiveImg from '../image/ResponsiveImg'
import Left from '../view/Left'
import Right from '../view/Right'

const Overlay = styled.View`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
`

const GuideModalContainer = styled.View`
	flex: 1;
	z-index: 1;
	justify-content: space-between;
	flex-direction: column;
	background-color: rgba(0, 0, 0, 0.75);
`

const GuideModalHeader = styled.SafeAreaView`
	position: relative;
	flex: 1;
	z-index: 1;
	align-items: flex-start;
	justify-content: space-between;
	top: ${verticalScale(24)}px;
	right: ${horizontalScale(24)}px;
	flex-direction: row;
`

const GuideModalContents = styled.View`
	flex: 13;
`

const StepImageView = styled.View`
	flex: 1;
	align-self: center;
	justify-content: center;
	bottom: ${Platform.OS === 'ios' ? 10 : 16}px;
`

let sliderWidth = Dimensions.get('window').width
let itemWidth = Math.round(sliderWidth * 1)

const guideStepList = [
	{
		index: -1,
		image: () => <></>,
	},
	{
		index: 0,
		image: () => (
			<StepImageView>
				<ResponsiveImg source={require('@assets/images/step_1.png')} width={360} height={640} />
			</StepImageView>
		),
	},
	{
		index: 1,
		image: () => (
			<StepImageView>
				<ResponsiveImg source={require('@assets/images/step_2.png')} width={360} height={640} />
			</StepImageView>
		),
	},
	{
		index: 2,
		image: () => (
			<StepImageView>
				<ResponsiveImg source={require('@assets/images/step_3.png')} width={360} height={640} />
			</StepImageView>
		),
	},
	{
		index: 3,
		image: () => (
			<StepImageView>
				<ResponsiveImg source={require('@assets/images/step_4.png')} width={360} height={640} />
			</StepImageView>
		),
	},
	{
		index: 5,
		image: () => (
			<StepImageView>
				<ResponsiveImg source={require('@assets/images/step_5.png')} width={360} height={640} />
			</StepImageView>
		),
	},
	{
		index: 6,
		image: () => <></>,
	},
]

export default function UsageGuideInfoModal({ guideModal, setGuideModal }) {
	const [guideStep, setGuideStep] = useState(1)
	const isCarousel = useRef(null)

	function closeModal() {
		setGuideModal(false)
		setGuideStep(1)
	}

	function _renderItem({ item, index }) {
		return (
			<Overlay key={index}>
				<StatusBar
					animated={true}
					hidden={true}
					showHideTransition="fade"
					backgroundColor={'rgba(0, 0, 0, 0.68)'}
					// translucent
				/>
				<GuideModalContainer>
					<GuideModalHeader>
						<Left></Left>
						<Right>
							{guideStep > 4 ? (
								<Pressable onPressIn={() => closeModal()}>
									<CloseStepSvg width={moderateScale(36)} height={moderateScale(36)} />
								</Pressable>
							) : (
								<Pressable
									onPressIn={() => {
										setGuideStep(guideStep + 1)
										if (guideStep >= 0 && guideStep <= 4) isCarousel.current.snapToNext()
									}}
								>
									<ArrowNextStepSvg width={moderateScale(36)} height={moderateScale(36)} />
								</Pressable>
							)}
						</Right>
					</GuideModalHeader>
					<GuideModalContents>
						<item.image />
					</GuideModalContents>
				</GuideModalContainer>
			</Overlay>
		)
	}
	return (
		<Modal transparent={true} visible={guideModal} animationType="fade" onRequestClose={() => closeModal()}>
			<Carousel
				ref={isCarousel}
				data={guideStepList}
				renderItem={_renderItem}
				useScrollView={false}
				sliderWidth={sliderWidth}
				itemWidth={itemWidth}
				onSnapToItem={(nextIndex) => {
					if (nextIndex === 6) {
						closeModal()
					} else if (nextIndex === 0) {
						closeModal()
					} else {
						setGuideStep(nextIndex)
					}
				}}
				firstItem={1}
				autoplay
				autoplayDelay={1000}
				enableMomentum={true}
				decelerationRate={0.9}
				inactiveSlideScale={0.9}
				inactiveSlideOpacity={0.5}
				activeSlideAlignment="end"
			/>
		</Modal>
	)
}
