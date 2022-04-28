import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AuthStackFlow from './flow/AuthStackFlow'
import MainTabFlow from '../tab/flow/MainTabFlow'
import constants from '@/navigations/constants'
import SearchTabFlow from '../tab/flow/SearchTabFlow'
import MyChabapTabFlow from '../tab/flow/MyChabapTabFlow'

const { AUTH_STACK_FLOW, MAIN_TAB_FLOW, SEARCH_TAB_FLOW, MY_CHABAP_TAB_FLOW } = constants

const Stack = createNativeStackNavigator()

export default function DefaultStackNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{/* {!userState.accessToken || !userState.isLoggined ? (
				<>
					<Stack.Screen name={AUTH_STACK_FLOW} component={AuthStackFlow} />
				</>
			) : (
				<>
					<Stack.Screen name={MAIN_TAB_FLOW} component={MainTabFlow} />
					<Stack.Screen name={SEARCH_TAB_FLOW} component={SearchTabFlow} />
					<Stack.Screen name={MY_CHABAP_TAB_FLOW} component={MyChabapTabFlow} />
				</>
			)} */}
			<Stack.Screen name={AUTH_STACK_FLOW} component={AuthStackFlow} />
			<Stack.Screen name={MAIN_TAB_FLOW} component={MainTabFlow} />
			<Stack.Screen name={SEARCH_TAB_FLOW} component={SearchTabFlow} />
			<Stack.Screen name={MY_CHABAP_TAB_FLOW} component={MyChabapTabFlow} />
		</Stack.Navigator>
	)
}
