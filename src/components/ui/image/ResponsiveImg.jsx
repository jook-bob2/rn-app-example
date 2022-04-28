import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

export default function ResponsiveImg({ source, width, height }) {
	return (
		<View style={styles.responsiveContainer}>
			<Image style={{ ...styles.responsiveImg, aspectRatio: width / height }} source={source} />
		</View>
	)
}

const styles = StyleSheet.create({
	responsiveContainer: {
		flex: 1,
		width: '100%',
	},
	responsiveImg: {
		width: '100%',
		height: '100%',
		marginLeft: 'auto',
		marginRight: 'auto',
		resizeMode: 'contain',
	},
})
