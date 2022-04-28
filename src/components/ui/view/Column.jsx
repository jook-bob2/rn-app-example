import React from 'react'
import styled from 'styled-components/native'

const Container = styled.View`
	flex-direction: column;
`

export default function Column({ children, style }) {
	return <Container style={style}>{children}</Container>
}
