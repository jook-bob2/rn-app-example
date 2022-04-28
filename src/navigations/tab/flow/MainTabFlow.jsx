import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import mainTabList from '../tabList/mainTabList'
import AppContainer from '@/screens/AppContainer'
import TabBar from '@/components/ui/TabBar'
import constants from '@/navigations/constants'

const { MAIN_SCREEN } = constants

const Tab = createBottomTabNavigator()

export default function MainTabFlow() {
	return (
		<Tab.Navigator backBehavior="history" initialRouteName={MAIN_SCREEN} tabBar={(props) => <TabBar {...props} />}>
			{mainTabList.map((menu, index) => (
				<Tab.Screen key={index} name={menu.name} options={{ ...menu.options }} initialParams={menu.params}>
					{(props) => (
						<AppContainer {...props} Screen={menu.component} backgroundOption={menu.backgroundOption} />
					)}
				</Tab.Screen>
			))}
		</Tab.Navigator>
	)
}
