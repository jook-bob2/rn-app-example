import React, { memo } from 'react'
import styled from 'styled-components/native'

const Container = styled.View`
	align-items: center;
`

const Center = ({ children, style }) => <Container style={style}>{children}</Container>

export default memo(Center)
