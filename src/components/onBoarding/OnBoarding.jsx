import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { useDeviceOrientation } from '@react-native-community/hooks'
import OnBoardingStep from './step/OnBoardingStep'
import OnBoardingLast from './step/OnBoardingLast'
import { storageUtil } from '@/utils/storageUtil'
import storageConst from '@/constants/storageConst'
import { useNavigation } from '@react-navigation/core'
import constants from '@/navigations/constants'
import { Onboarding1Svg, Onboarding2Svg, Onboarding3Svg } from '@util/svgUtil'
import { moderateScale } from '@/theme/scaling'
import { useBackColor } from '@/core/store/common/providers/BackColorProvider'
import { theme } from '@/theme'

const { TUTORIAL_FLAG } = storageConst
const { MAIN_TAB_FLOW, MAIN_SCREEN } = constants

const Container = styled.ScrollView`
	flex: 1;
`

export default function OnBoarding() {
	const { replace } = useNavigation()
	const [currentTab, setCurrentTab] = useState(0)
	const [carouselList, setCarouselList] = useState([])
	const { setTopColor, setBottomColor } = useBackColor()
	useDeviceOrientation()

	useEffect(() => {
		if (currentTab === 3) {
			setTopColor(theme.colors.turquoise)
			setBottomColor(theme.colors.turquoise)
		} else {
			setTopColor(theme.colors.background)
		}
	}, [currentTab])

	useEffect(() => {
		storageUtil
			.getItem({ key: TUTORIAL_FLAG })
			.then((result) => {
				if (result?.data) {
					console.log('tutorial flag => ', result.data)
					replace(MAIN_TAB_FLOW, { screen: MAIN_SCREEN })
				} else {
					storageUtil.setItem({ key: TUTORIAL_FLAG, value: true, options: { addYear: 3 } })
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

	useEffect(() => {
		setCarouselList([
			{
				index: 0,
				text: '전기차에 밥을 주다.',
				subText: '앱 하나로 편하게 전기차 충전소를 이용하세요.',
				image: () => <Onboarding1Svg width={moderateScale(370)} height={moderateScale(290)} />,
			},
			{
				index: 1,
				text: '차량 맞춤형 충전소 추천!',
				subText: '등록된 차량 맞춤정보를 제공합니다.',
				image: () => <Onboarding2Svg width={moderateScale(332)} height={moderateScale(290)} />,
			},
			{
				index: 2,
				text: '필요할 때 언제 어디서나!',
				subText: '가까운 추천 충전소에서 차밥주세요.',
				image: () => <Onboarding3Svg width={moderateScale(332)} height={moderateScale(290)} />,
			},
		])

		return () => {
			setCarouselList([])
		}
	}, [])

	return (
		<>
			{currentTab >= 0 && currentTab <= 2 ? (
				<Container showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
					<OnBoardingStep carouselList={carouselList} setCurrentTab={setCurrentTab} currentTab={currentTab} />
				</Container>
			) : (
				<OnBoardingLast />
			)}
		</>
	)
}
