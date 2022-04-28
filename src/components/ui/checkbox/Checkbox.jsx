import { moderateScale } from '@theme/scaling'
import React, { memo } from 'react'
import styled from 'styled-components/native'

const Pressable = styled.Pressable`
	flex-direction: ${({ flexDirection }) => flexDirection};
`
const UncheckedView = styled.View`
	align-items: center;
`

const CheckedView = styled.View`
	align-items: center;
`

const DefaultCheckImg = styled.Image`
	width: ${moderateScale(14)}px;
	height: ${moderateScale(14)}px;
`

function Checkbox({
	checked,
	label = null,
	onPress,
	checkStyle,
	uncheckStyle,
	flexDirection = 'row',
	customTrueImage,
	customFalseImage,
}) {
	return (
		<Pressable onPress={onPress} flexDirection={flexDirection}>
			{checked ? (
				<CheckedView style={checkStyle}>
					{customTrueImage ? (
						customTrueImage
					) : (
						<DefaultCheckImg source={require('@assets/icons/check.png')} />
					)}
				</CheckedView>
			) : (
				<UncheckedView style={uncheckStyle}>{customFalseImage}</UncheckedView>
			)}
			{label}
		</Pressable>
	)
}

export default memo(Checkbox)
