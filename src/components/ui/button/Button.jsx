import React, { memo } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '@/theme'
import { moderateScale } from '@/theme/scaling'

const Button = ({ mode, style, children, ...props }) => (
	<PaperButton
		style={[styles.button, mode === 'outlined' && { backgroundColor: theme.colors.darkGray }, style]}
		labelStyle={styles.text}
		mode={!mode ? 'contained' : mode}
		{...props}
	>
		{children}
	</PaperButton>
)

const styles = StyleSheet.create({
	button: {
		width: moderateScale(300),
		height: moderateScale(50),
		borderRadius: moderateScale(5),
		backgroundColor: theme.colors.turquoise,
		justifyContent: 'center',
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: {
					width: 0,
					height: 0,
				},
				shadowOpacity: 0,
				shadowRadius: 0,
			},
			android: {
				elevation: 0,
			},
		}),
	},
	text: {
		fontSize: theme.fonts.size.paragraph,
		color: '#ffffff',
		fontFamily: `${theme.fonts.spoqaHanSansNeo.bold}`,
		includeFontPadding: false,
	},
})

export default memo(Button)
