import React, { memo } from 'react'
import { theme } from '@/theme'
import styled from 'styled-components/native'
import { moderateScale } from '@/theme/scaling'

const Text = styled.Text`
	font-size: ${moderateScale(theme.fonts.size.title)}px;
	color: ${({ style }) => style?.color || theme.colors.turquoise};
	font-family: ${({ style }) => style?.fontFamily || theme.fonts.spoqaHanSansNeo.bold};
	include-font-padding: false;
`

const Title = ({ children, style }) => <Text style={style}>{children}</Text>

export default memo(Title)
