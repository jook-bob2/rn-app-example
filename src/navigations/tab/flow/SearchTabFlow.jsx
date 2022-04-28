import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AppContainer from '@/screens/AppContainer'
import TabBar from '@/components/ui/TabBar'
import constants from '@/navigations/constants'
import searchTabList from '../tabList/searchTabList'

const { CHARGING_STATION_SEARCH_SCREEN } = constants

const Tab = createBottomTabNavigator()

export default function SearchTabFlow() {
	return (
		<Tab.Navigator
			backBehavior="history"
			initialRouteName={CHARGING_STATION_SEARCH_SCREEN}
			tabBar={(props) => <TabBar {...props} />}
		>
			{searchTabList.map((menu, index) => (
				<Tab.Screen key={index} name={menu.name} options={menu.options} initialParams={menu.params}>
					{(props) => (
						<AppContainer {...props} Screen={menu.component} backgroundOption={menu.backgroundOption} />
					)}
				</Tab.Screen>
			))}
		</Tab.Navigator>
	)
}
