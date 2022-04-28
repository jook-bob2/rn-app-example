import { moderateScale } from '@theme/scaling'
import { SearchSvg } from '@util/svgUtil'
import React, { memo } from 'react'
import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'

// const Input = styled.TextInput`
// 	padding-top: ${verticalScale(18)}px;
// 	padding-right: ${horizontalScale(24)}px;
// 	padding-bottom: ${Platform.OS === 'ios' ? 0 : verticalScale(12)}px;
// 	padding-left: ${horizontalScale(15)}px;
// 	margin-right: ${horizontalScale(30)}px;
// 	color: ${theme.colors.darkGray};
// `

// const Text = styled.Text`
// 	font-size: ${moderateScale(14)}px;
// 	color: ${theme.colors.error};
// 	padding-horizontal: ${horizontalScale(4)}px;
// 	padding-top: ${Platform.OS === 'ios' ? verticalScale(24) : 0}px;
// 	font-family: ${theme.fonts.spoqaHanSansNeo.medium};
// 	padding-left: ${horizontalScale(20)}px;
// `

const SearchView = styled.View``

// const VisibilityImg = styled.Image`
// 	width: ${moderateScale(21)}px;
// 	height: ${moderateScale(17)}px;
// 	tint-color: ${theme.colors.disabled};
// `

const SearchInput = ({ style, pressIcon }) => {
	return (
		<SearchView style={style}>
			<TouchableOpacity onPress={() => pressIcon()}>
				<SearchSvg width={moderateScale(20)} height={moderateScale(20)} />
			</TouchableOpacity>
		</SearchView>
	)
}

export default memo(SearchInput)
