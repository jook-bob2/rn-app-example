import Left from '@/components/ui/view/Left'
import { theme } from '@/theme'
import React from 'react'
import styled from 'styled-components/native'
import { moderateScale, verticalScale } from '@theme/scaling'
import SmallText from '@/components/ui/text/SmallText'
import { Platform } from 'react-native'
import ResponsiveImg from '@/components/ui/image/ResponsiveImg'

const Container = styled.View``

const Header = styled.View``

const Banner = styled.View`
	align-items: center;
	justify-content: center;
	margin-top: ${verticalScale(16)}px;
`

export default function MainElecTip() {
	return (
		<Container>
			<Header>
				<Left>
					<SmallText style={{ fontSize: moderateScale(16), fontFamily: theme.fonts.spoqaHanSansNeo.bold }}>
						차밥 전기차 Tip
					</SmallText>
				</Left>
			</Header>
			<Banner>
				{Platform.OS === 'ios' ? (
					<ResponsiveImg source={require('@assets/images/charge_tip_ios.png')} width={350} height={98} />
				) : (
					<ResponsiveImg source={require('@assets/images/charge_tip_android.png')} width={400} height={98} />
				)}
			</Banner>
		</Container>
	)
}
