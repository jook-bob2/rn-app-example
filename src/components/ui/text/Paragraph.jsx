import React, { memo } from 'react'
import { theme } from '@/theme'
import styled from 'styled-components/native'
import { moderateScale } from '@/theme/scaling'

const Text = styled.Text`
	font-size: ${moderateScale(theme.fonts.size.paragraph)}px;
	color: ${({ style }) => style?.color || theme.colors.text};
	font-family: ${({ style }) => style?.fontFamily || theme.fonts.spoqaHanSansNeo.medium};
	include-font-padding: false;
`

const Paragraph = ({ children, style }) => <Text style={style}>{children}</Text>

export default memo(Paragraph)
