import Left from '@/components/ui/view/Left'
import { theme } from '@/theme'
import React from 'react'
import styled from 'styled-components/native'
import { moderateScale } from '@theme/scaling'
import Right from '@/components/ui/view/Right'
import { ArrowNextSvg } from '@/utils/svgUtil'
import SmallText from '@/components/ui/text/SmallText'

const Container = styled.View``

const Pressable = styled.Pressable`
	flex-direction: row;
	justify-content: space-between;
	padding-bottom: ${moderateScale(8)}px;
`

const Banner = styled.View`
	align-items: center;
	justify-content: center;
`

const BannerImg = styled.Image`
	width: ${moderateScale(282)}px;
	height: ${moderateScale(98)}px;
`

export default function MainChargeGuide() {
	return (
		<Container>
			<Pressable onPress={() => {}}>
				<Left>
					<SmallText style={{ fontSize: moderateScale(16), fontFamily: theme.fonts.spoqaHanSansNeo.bold }}>
						충전 안내
					</SmallText>
				</Left>
				<Right style={{ alignSelf: 'center' }}>
					<ArrowNextSvg width={moderateScale(4)} height={moderateScale(8)} />
				</Right>
			</Pressable>
			<Banner>
				<BannerImg source={require('@assets/images/blank_vertical.png')} />
			</Banner>
		</Container>
	)
}
