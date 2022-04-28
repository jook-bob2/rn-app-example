import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import { CheckSvg } from '@util/svgUtil'
import React, { memo } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
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

const Text = styled.Text`
	font-size: ${moderateScale(14)}px;
	color: ${theme.colors.error};
	padding-horizontal: ${moderateScale(4)}px;
	padding-top: ${Platform.OS === 'ios' ? moderateScale(24) : 0}px;
	font-family: ${theme.fonts.spoqaHanSansNeo.medium};
	padding-left: ${moderateScale(20)}px;
`
const SvgView = styled.View`
	flex-direction: row;
`

const ButtonView = styled.View`
	position: absolute;
	flex-direction: row;
	align-self: flex-end;
	align-items: center;
	padding: ${moderateScale(7)}px ${horizontalScale(1)}px;
`

const EmailInput = ({
	errorText,
	style,
	pressButton,
	inputStyle,
	childRef,
	buttonTitle,
	secondButtonTitle,
	btnView,
	btnToggle,
	emailValue,
	cancelButton,
	disabled,
	checkFlag,
	...props
}) => {
	return (
		<View style={[style, styles.container]}>
			<Input {...props} ref={childRef} style={inputStyle} />
			<ButtonView style={btnView}>
				{!btnToggle ? (
					<PaperButton
						style={{
							...styles.button,
							backgroundColor: emailValue ? theme.colors.white : theme.colors.white,
						}}
						labelStyle={styles.label}
						onPress={() => pressButton()}
						disabled={disabled}
					>
						<SmallText>{buttonTitle}</SmallText>
					</PaperButton>
				) : checkFlag ? (
					<TouchableOpacity
						style={{
							...styles.verifyCompeletBtn,
							flexDirection: 'row',
						}}
						onPress={() => cancelButton()}
						disabled={disabled}
					>
						<SvgView>
							<CheckSvg
								style={{ alignSelf: 'center', marginRight: 1 }}
								width={moderateScale(12)}
								height={moderateScale(12)}
							/>
						</SvgView>
						<SmallText style={styles.verifyCompelet}>{secondButtonTitle}</SmallText>
					</TouchableOpacity>
				) : (
					<PaperButton
						style={{
							...styles.buttonTwo,
						}}
						labelStyle={styles.label}
						onPress={() => cancelButton()}
						disabled={disabled}
					>
						{secondButtonTitle}
					</PaperButton>
				)}
			</ButtonView>
			{errorText ? (
				<Text
					style={{
						alignSelf: 'flex-start',
						height: Platform.OS === 'ios' ? verticalScale(70) : verticalScale(50),
					}}
				>
					{errorText}
				</Text>
			) : null}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.white,
		width: '100%',
		height: moderateScale(51),
	},
	button: {
		width: moderateScale(83),
		height: verticalScale(36),
		borderRadius: moderateScale(18),
		backgroundColor: theme.colors.white,
		borderColor: theme.colors.text,
		borderWidth: moderateScale(2),
	},
	buttonTwo: {
		width: moderateScale(81),
		height: verticalScale(35),
		borderRadius: moderateScale(18),
		borderWidth: moderateScale(2),
		backgroundColor: theme.colors.white,
		borderColor: theme.colors.text,
	},
	label: {
		width: '100%',
		fontSize: moderateScale(11),
		lineHeight: verticalScale(16),
		color: theme.colors.text,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	verifyCompelet: {
		fontSize: moderateScale(11),
		lineHeight: verticalScale(13),
		alignSelf: 'center',
		marginLeft: horizontalScale(2),
		color: theme.colors.turquoise,
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	verifyCompeletBtn: {
		width: moderateScale(81),
		height: verticalScale(35),
		borderRadius: 22,
		backgroundColor: theme.colors.background,
		paddingLeft: moderateScale(16),
		paddingRight: moderateScale(16),
	},
})

export default memo(EmailInput)
