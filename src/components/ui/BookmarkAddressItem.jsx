import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React from 'react'
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import styled from 'styled-components/native'
import SmallText from './text/SmallText'
const ItemIcon = styled.View`
	width: ${moderateScale(35)}px;
	height: ${moderateScale(35)}px;
	border-color: ${theme.colors.disabled};
	align-items: center;
`
const BookItemIcon = styled.View`
	width: ${moderateScale(20)}px;
	height: ${moderateScale(20)}px;
	border-color: ${theme.colors.disabled};
	align-items: center;
`
// const DefaultItemIcon = styled.Image`
// 	width: ${moderateScale(15)}px;
// 	height: ${moderateScale(15)}px;
// `
const ItemContents = styled.View`
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(2)}px;
	border-radius: ${moderateScale(22)}px;
	border-color: ${theme.colors.disabled};
	margin: ${verticalScale(3)}px;
	padding: ${moderateScale(15)}px;
	width: ${moderateScale(350)}px;
`

export default function BookmarkAddressItem({
	headText,
	subText,
	onPress,
	buttonStyle,
	itemIconStyle,
	onPressModify,
	onpressDelete,
	icon,
	bookIcon,
	itemTextStyle,
	headTextStyle,
	subTextStyle,
	itemContentsStyle,
	buttonText,
}) {
	return (
		<ItemContents style={itemContentsStyle}>
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				<View style={itemIconStyle}>
					<ItemIcon>{icon ? icon : undefined}</ItemIcon>
				</View>

				<View style={{ ...styles.inputContent, itemTextStyle }}>
					<TouchableOpacity style={styles.container} onPress={onPress}>
						<SmallText style={headTextStyle}>{headText}</SmallText>
						<SmallText style={subTextStyle}>{subText}</SmallText>
					</TouchableOpacity>
				</View>
				<View style={itemIconStyle}>
					<BookItemIcon>
						<Pressable onPress={onpressDelete} labelStyle={styles.labelText}>
							{bookIcon ? bookIcon : undefined}
						</Pressable>
					</BookItemIcon>
				</View>
			</View>

			{buttonText ? (
				<PaperButton onPress={onPressModify} style={buttonStyle} labelStyle={styles.labelText}>
					{buttonText}
				</PaperButton>
			) : undefined}
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
		fontSize: 12,
		lineHeight: 13,
		color: '#ffffff',
		fontFamily: `${theme.fonts.spoqaHanSansNeo.bold}`,
	},
})
