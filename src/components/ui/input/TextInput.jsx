import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import { CancelSvg, CloseEyeSvg, OpenEyeSvg, SearchSvg } from '@util/svgUtil'
import React, { memo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'

const Input = styled.TextInput`
	padding-top: ${moderateScale(18)}px;
	padding-right: ${moderateScale(24)}px;
	padding-bottom: ${Platform.OS === 'ios' ? 0 : moderateScale(12)}px;
	padding-left: ${moderateScale(24)}px;
	color: ${theme.colors.text};
`

const Text = styled.Text`
	font-size: ${moderateScale(14)}px;
	color: ${theme.colors.error};
	padding-horizontal: ${moderateScale(4)}px;
	padding-top: ${Platform.OS === 'ios' ? moderateScale(14) : 0}px;
	font-family: ${theme.fonts.spoqaHanSansNeo.medium};
	padding-left: ${moderateScale(20)}px;
`

const SecureView = styled.View`
	position: absolute;
	flex-direction: row;
	align-self: flex-end;
	align-items: center;
	justify-content: center;
	padding-right: ${horizontalScale(8)}px;
	height: ${verticalScale(50)}px;
`

const RemoveView = styled.View`
	position: absolute;
	flex-direction: row;
	align-self: flex-end;
	align-items: center;
	padding-right: ${horizontalScale(8)}px;
	height: ${verticalScale(50)}px;
`

const SearchView = styled.View`
	position: absolute;
	flex-direction: row;
	align-self: flex-end;
	align-items: center;
	/* padding: ${verticalScale(18)}px ${horizontalScale(8)}px; */
	padding: ${verticalScale(18)}px ${horizontalScale(8)}px ${verticalScale(18)}px ${horizontalScale(18)}px;
`

const Pressable = styled.Pressable`
	align-content: center;
	margin-right: ${horizontalScale(14)}px;
`

const TextInput = ({
	isShadow = true,
	errorText,
	style,
	setVisible,
	setRemoveText,
	setSearchText,
	inputStyle,
	childRef,
	...props
}) => {
	return (
		<View style={[style, styles.container, isShadow ? styles.shadow : null]}>
			<Input
				placeholderTextColor={theme.colors.placeholder}
				{...props}
				ref={childRef}
				style={{ ...inputStyle, ...styles.inputStyle }}
			/>
			{props.type === 'password' && props.value.length > 0 ? (
				<SecureView>
					{props.secureTextEntry === true ? (
						<Pressable onPressIn={() => setVisible()}>
							<CloseEyeSvg
								width={moderateScale(20)}
								height={moderateScale(20)}
								fill={theme.colors.text}
							/>
						</Pressable>
					) : props.secureTextEntry === false ? (
						<Pressable onPressIn={() => setVisible()}>
							<OpenEyeSvg width={moderateScale(20)} height={moderateScale(25)} fill={theme.colors.text} />
						</Pressable>
					) : null}
					{props.value.length > 0 && (
						<Pressable onPress={() => setRemoveText()}>
							<CancelSvg width={moderateScale(20)} height={moderateScale(20)} fill={theme.colors.text} />
						</Pressable>
					)}
				</SecureView>
			) : props.type === 'text' && props.value.length > 0 ? (
				<RemoveView>
					<Pressable onPress={() => setRemoveText()}>
						<CancelSvg width={moderateScale(20)} height={moderateScale(20)} fill={theme.colors.text} />
					</Pressable>
				</RemoveView>
			) : props.type === 'search' ? (
				<SearchView>
					{props.value.length > 0 && (
						<Pressable onPress={() => setRemoveText()}>
							<CancelSvg width={moderateScale(20)} height={moderateScale(20)} fill={theme.colors.text} />
						</Pressable>
					)}
					<Pressable onPress={() => setSearchText()}>
						<SearchSvg width={moderateScale(20)} height={moderateScale(20)} fill={theme.colors.text} />
					</Pressable>
				</SearchView>
			) : null}

			{errorText ? (
				<Text
					style={{
						alignSelf: 'flex-start',
						height: Platform.OS === 'ios' ? verticalScale(70) : verticalScale(50),
						marginTop: verticalScale(5),
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
		// backgroundColor: theme.colors.white,
		width: '100%',
		height: verticalScale(50),
	},
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: moderateScale(4),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(4.65),
		elevation: 5,
	},
	inputStyle: {
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		color: theme.colors.text,
	},
})

export default memo(TextInput)
