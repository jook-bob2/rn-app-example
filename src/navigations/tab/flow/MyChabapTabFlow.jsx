import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AppContainer from '@/screens/AppContainer'
import TabBar from '@/components/ui/TabBar'
import constants from '@/navigations/constants'
import myChabapTabList from '../tabList/myChabapTabList'

const { MY_CHABAP_MAIN_SCREEN } = constants

const Tab = createBottomTabNavigator()

export default function MyChabapTabFlow() {
	return (
		<Tab.Navigator
			backBehavior="history"
			initialRouteName={MY_CHABAP_MAIN_SCREEN}
			tabBar={(props) => <TabBar {...props} />}
		>
			{myChabapTabList.map((menu, index) => (
				<Tab.Screen key={index} name={menu.name} options={menu.options} initialParams={menu.params}>
					{(props) => (
						<AppContainer {...props} Screen={menu.component} backgroundOption={menu.backgroundOption} />
					)}
				</Tab.Screen>
			))}
		</Tab.Navigator>
	)
}
