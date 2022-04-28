import { Platform } from 'react-native'
import { DefaultTheme } from 'react-native-paper'
import { moderateScale, verticalScale } from './scaling'

export const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#600EE6',
		secondary: '#414757',
		error: '#ff0000',
		header: '#FFFFFF',
		aliceBlue: '#f0f8ff',
		white: '#FFFFFF',
		subtitle: '#535151',
		turquoise: '#23C7D0',
		disabled: '#dedede',
		darkGray: '#797979',
		orange: '#FFAE1B',
		danger: '#FF0000',
		text: '#191919',
		text2: '#494949',
		background: '#f8f8fa',
		line: '#e8e8e8',
		lightGray: '#cccccc',
		placeholder: '#999999',
	},
	fonts: {
		spoqaHanSansNeo: {
			bold: 'SpoqaHanSansNeo-Bold',
			light: 'SpoqaHanSansNeo-Light',
			medium: 'SpoqaHanSansNeo-Medium',
			regular: 'SpoqaHanSansNeo-Regular',
			thin: 'SpoqaHanSansNeo-Thin',
		},
		size: {
			title: moderateScale(30),
			subTitle: moderateScale(24),
			paragraph: moderateScale(18),
			small: moderateScale(14),
		},
	},
	common: {
		flexCenterRow: `
			flex: 1;
			flex-direction: row;
			justify-content: center;
    		align-items: center;
		`,
		flexCenterColumn: `
			flex: 1;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		`,
	},
	shadow: (height = 1, width = 0, backgroundColor = '#FFFFFF', shadowColor = '#000') => {
		return {
			...Platform.select({
				ios: {
					shadowColor: shadowColor,
					shadowOffset: {
						width: verticalScale(width),
						height: verticalScale(height),
					},
					shadowOpacity: height / 8,
					shadowRadius: moderateScale(height),
				},
				android: {
					backgroundColor: backgroundColor,
					elevation: height,
				},
			}),
		}
	},
}
