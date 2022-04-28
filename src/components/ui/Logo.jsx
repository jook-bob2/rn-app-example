import React, { memo } from 'react'
import styled from 'styled-components/native'

const Container = styled.View`
	padding-top: 20px;
`

const Image = styled.Image`
	width: ${({ width }) => width || 128}px;
	height: ${({ height }) => height || 128}px;
	margin-bottom: ${({ bottom }) => bottom || 12}px;
`

const Logo = ({ source, width, height, bottom }) => {
	return (
		<Container>
			<Image source={source} height={height} width={width} bottom={bottom} />
		</Container>
	)
}

export default memo(Logo)
