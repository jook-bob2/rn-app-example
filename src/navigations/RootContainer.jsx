import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import DefaultStackNavigator from './stack/DefaultStackNavigator'
import { navigationRef } from '@/navigations/RootNavigation'
import PermissionContainer from '@/screens/PermissionContainer'

export default function RootContainer() {
	return (
		<PermissionContainer>
			<NavigationContainer ref={navigationRef}>
				<DefaultStackNavigator />
			</NavigationContainer>
		</PermissionContainer>
	)
}
