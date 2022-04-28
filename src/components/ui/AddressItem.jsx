import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'
import SmallText from './text/SmallText'

const ItemIcon = styled.View`
	width: ${moderateScale(24)}px;
	height: ${moderateScale(24)}px;
	align-items: center;
	padding-top: ${horizontalScale(7.5)}px;
	padding-right: ${horizontalScale(1.5)}px;
	padding-left: ${horizontalScale(1.5)}px;
	background-color: ${theme.colors.white};
	border-radius: ${moderateScale(33)}px;
`

const ItemContents = styled.View`
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(2)}px;
	border-radius: ${moderateScale(5)}px;
	border-color: ${theme.colors.white};
	margin-top: ${verticalScale(16)}px;
	padding-top: ${verticalScale(16)}px;
	height: ${moderateScale(85)}px;
	flex-direction: row;
	padding: 16px;
`

export default function AddressItem({
	headText,
	subText,
	onPress,
	itemIconStyle,
	icon,
	itemTextStyle,
	headTextStyle,
	subTextStyle,
}) {
	return (
		<ItemContents>
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				<ItemIcon style={{ ...theme.shadow() }}>{icon ? icon : undefined}</ItemIcon>

				<View style={{ ...styles.inputContent, itemTextStyle }}>
					<TouchableOpacity style={styles.container} onPress={onPress}>
						<SmallText style={headTextStyle}>{headText}</SmallText>
						<SmallText style={subTextStyle}>{subText}</SmallText>
					</TouchableOpacity>
				</View>
			</View>
		</ItemContents>
	)
}

const styles = StyleSheet.create({
	container: {
		alignSelf: 'center',
		borderBottomWidth: 0,
		height: 40,
	},

	inputContent: {
		flexDirection: 'row',
	},

	labelText: {
		fontSize: 13,
		lineHeight: 16,
		color: '#ffffff',
		fontFamily: `${theme.fonts.spoqaHanSansNeo.bold}`,
	},
})
