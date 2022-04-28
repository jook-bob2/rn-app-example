import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import authStackList from '../stackList/authStackList'
import AppContainer from '@/screens/AppContainer'
import constants from '@/navigations/constants'

const { ON_BOARDING_SCREEN } = constants

const Stack = createNativeStackNavigator()

export default function AuthStackFlow() {
	return (
		<Stack.Navigator initialRouteName={ON_BOARDING_SCREEN}>
			{authStackList.map((menu, index) => (
				<Stack.Screen key={index} name={menu.name} options={menu.options} initialParams={menu.params}>
					{(props) => (
						<AppContainer {...props} Screen={menu.component} backgroundOption={menu.backgroundOption} />
					)}
				</Stack.Screen>
			))}
		</Stack.Navigator>
	)
}
