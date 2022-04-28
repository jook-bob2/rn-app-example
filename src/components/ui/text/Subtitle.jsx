import React, { memo } from 'react'
import { theme } from '@/theme'
import styled from 'styled-components/native'
import { moderateScale } from '@/theme/scaling'

const Text = styled.Text`
	font-size: ${moderateScale(theme.fonts.size.subTitle)}px;
	color: ${({ style }) => style?.color || theme.colors.subtitle};
	font-family: ${({ style }) => style?.fontFamily || theme.fonts.spoqaHanSansNeo.bold};
	include-font-padding: false;
`

const Subtitle = ({ children, style }) => <Text style={style}>{children}</Text>

export default memo(Subtitle)
