import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AppContainer from '@/screens/AppContainer'
import TabBar from '@/components/ui/TabBar'
import googleMapTabList from '../tabList/googleMapTabList'

const Tab = createBottomTabNavigator()

export default function GoogleMapTabFlow() {
	return (
		<Tab.Navigator
			backBehavior="history"
			initialRouteName="GoogleMapScreen"
			tabBar={(props) => <TabBar {...props} />}
		>
			{googleMapTabList.map((menu) => (
				<Tab.Screen key={menu.index} name={menu.name} options={menu.options} initialParams={menu.params}>
					{(props) => (
						<AppContainer {...props} Screen={menu.component} backgroundOption={menu.backgroundOption} />
					)}
				</Tab.Screen>
			))}
		</Tab.Navigator>
	)
}
