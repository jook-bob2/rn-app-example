import React, { memo, useEffect, useState } from 'react'
import { Animated, Easing, Pressable, StyleSheet } from 'react-native'
import styled from 'styled-components/native'

const Wrap = styled.View`
	flex-direction: row;
	align-items: center;
`

const ToggleContainer = styled.View`
	width: 54px;
	height: 20px;
	border-radius: 20px;
	justify-content: center;
`

const ToggleWheel = styled(Animated.View)`
	width: 15px;
	height: 15px;
	background-color: white;
	border-radius: 7.5px;
`

const Switch = ({ isSwitchOn, onSelectSwitch, selectionColor, disabledColor }) => {
	const [getValue, setValue] = useState(false)
	const [aniValue] = useState(new Animated.Value(0))

	useEffect(() => {
		setValue(isSwitchOn)
	}, [isSwitchOn])

	const moveSwitchToggle = aniValue.interpolate({
		inputRange: [0, 1],
		outputRange: [4, 34],
	})

	Animated.timing(aniValue, {
		toValue: getValue ? 1 : 0,
		duration: 200,
		easing: Easing.linear,
		useNativeDriver: true,
	}).start()

	return (
		<Wrap>
			<Pressable onPress={() => onSelectSwitch(!getValue)}>
				<ToggleContainer style={{ backgroundColor: getValue ? selectionColor : disabledColor }}>
					<ToggleWheel style={[styles.toggleWheel, { transform: [{ translateX: moveSwitchToggle }] }]} />
				</ToggleContainer>
			</Pressable>
		</Wrap>
	)
}

const styles = StyleSheet.create({
	toggleWheel: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 2.5,
		elevation: 1.5,
	},
})

export default memo(Switch)
