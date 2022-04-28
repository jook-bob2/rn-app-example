import React, { memo } from 'react'
import styled from 'styled-components/native'

const Container = styled.View`
	flex-direction: row;
	align-items: flex-end;
`

const Right = ({ children, style }) => <Container style={style}>{children}</Container>

export default memo(Right)
