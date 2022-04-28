import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import React, { memo } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'
import SmallText from '../text/SmallText'

const Input = styled.TextInput`
	padding-top: ${verticalScale(18)}px;
	padding-right: ${horizontalScale(40)}px;
	padding-bottom: ${Platform.OS === 'ios' ? 0 : verticalScale(12)}px;
	padding-left: ${horizontalScale(10)}px;
	margin-right: ${horizontalScale(50)}px;
	color: ${theme.colors.darkGray};
`

// const Text = styled.Text`
// 	font-size: ${moderateScale(14)}px;
// 	color: ${theme.colors.error};
// 	padding-horizontal: ${horizontalScale(4)}px;
// 	padding-top: ${Platform.OS === 'ios' ? verticalScale(24) : 0}px;
// 	font-family: ${theme.fonts.spoqaHanSansNeo.medium};
// 	padding-left: ${horizontalScale(20)}px;
// `

const ButtonView = styled.View`
	position: absolute;
	flex-direction: row;
	align-self: flex-end;
	padding: ${moderateScale(11)}px;
`

const AddressInput = ({ style, pressButton, inputStyle, childRef, labelStyle, buttonTitle, buttonStyle, ...props }) => {
	return (
		<View style={[style, styles.container]}>
			<Input {...props} ref={childRef} style={inputStyle} />
			<ButtonView>
				<TouchableOpacity style={buttonStyle} onPress={() => pressButton()}>
					<SmallText style={labelStyle}>{buttonTitle}</SmallText>
				</TouchableOpacity>
			</ButtonView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.white,
		shadowColor: '#29d1d1d1',

		borderBottomColor: theme.colors.line,
		borderBottomWidth: verticalScale(1),
		width: '100%',
		height: verticalScale(51),
		borderRadius: moderateScale(5),
		justifyContent: 'space-between',
	},
})

export default memo(AddressInput)
