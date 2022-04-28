import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import FareInformation from './chabapGuide/FareInformation'
import SubsidyGuide from './chabapGuide/SubsidyGuide'
import ChargerInformation from './chabapGuide/ChargerInformation'
import { theme } from '@/theme'
import { horizontalScale, verticalScale } from '@theme/scaling'
import styled from 'styled-components/native'

const Tab = createMaterialTopTabNavigator()

const Container = styled.View`
	flex: 1;
	background-color: #f8f8fa;
	margin: ${verticalScale(16)}px ${horizontalScale(24)}px;
`
export default function NoticeChabapGuide() {
	return (
		<Container>
			<View style={styles.View}>
				<Tab.Navigator
					screenOptions={{
						animationEnabled: false,
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
							...theme.shadow(),
						},
						tabBarPressColor: 'rgba(0, 0, 0, 0)',
					}}
				>
					<Tab.Screen name="보조금안내" component={SubsidyGuide} />
					<Tab.Screen name="요금안내" component={FareInformation} />
					<Tab.Screen name="충전기정보" component={ChargerInformation} />
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
