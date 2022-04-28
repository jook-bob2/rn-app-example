import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import NoticeEvent from './NoticeEvent'
import NoticeEventEnd from './NoticeEventEnd'
import { theme } from '@/theme'
import { horizontalScale, verticalScale } from '@theme/scaling'
import styled from 'styled-components/native'

const Tab = createMaterialTopTabNavigator()

const Container = styled.View`
	flex: 1;
	background-color: #f8f8fa;
	margin: ${verticalScale(16)}px ${horizontalScale(24)}px;
`

export default function NoticeEventGuide() {
	return (
		<Container>
			<View style={styles.View}>
				<Tab.Navigator
					screenOptions={{
						tabBarLabelStyle: {
							//height: moderateScale(20),
							fontSize: 16,
							fontFamily: theme.fonts.spoqaHanSansNeo.regular,
							includeFontPadding: false,
						},
						tabBarIndicatorStyle: {
							height: '100%',
							backgroundColor: '#23C7D0',
							borderRadius: 5,
						},
						tabBarActiveTintColor: theme.colors.white,
						tabBarInactiveTintColor: '#191919',
						tabBarStyle: {
							borderRadius: 5,
							marginBottom: verticalScale(16),
							...theme.shadow(),
						},
						tabBarPressColor: 'rgba(0, 0, 0, 0)',
					}}
				>
					<Tab.Screen name="진행중" component={NoticeEvent} />
					<Tab.Screen name="종료" component={NoticeEventEnd} />
				</Tab.Navigator>
			</View>
		</Container>
	)
}
const styles = StyleSheet.create({
	View: {
		flex: 1,
		backgroundColor: '#f8f8fa',
	},
})
