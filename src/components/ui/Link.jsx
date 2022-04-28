import React from 'react'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { StyleSheet } from 'react-native'
import SmallText from './text/SmallText'

const Container = styled.View`
	padding: 5px;
`
const Pressable = styled.Pressable`
	background-color: ${theme.colors.primary};
	border-radius: 8px;
	top: 20px;
	bottom: 0;
	padding: 0px 5px;
`

export default function Link({ children, onPress }) {
	return (
		<Container>
			<Pressable onPress={onPress}>
				<SmallText style={styles.text}>{children}</SmallText>
			</Pressable>
		</Container>
	)
}

const styles = StyleSheet.create({
	text: {
		color: theme.colors.background,
	},
})
