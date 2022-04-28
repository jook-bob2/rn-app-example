import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

const Item = ({ item, onPress }) => {
	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			<Text style={styles.text}>{item}</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		borderBottomWidth: 0,
		height: 40,
	},
	text: {
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: 16,
	},
})

export default Item
