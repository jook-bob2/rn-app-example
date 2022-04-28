import React from 'react'
import styled from 'styled-components/native'
import Paragraph from '../ui/text/Paragraph'
import { verticalScale } from '@theme/scaling'

const Container = styled.View`
	flex: 1;
	margin-bottom: ${verticalScale(10)}px;
`

export default function ChargingStationDetail() {
	return (
		<Container>
			<Paragraph>충전소 상세정보</Paragraph>
		</Container>
	)
}
