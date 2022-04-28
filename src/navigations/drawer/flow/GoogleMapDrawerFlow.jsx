// import React from 'react'
// import { createDrawerNavigator } from '@react-navigation/drawer'
// import CustomDrawerContent from '../content/CustomDrawerContent'
// import AppContainer from '@/screens/AppContainer'
// import googleMapDrawerList from '../drawerList/googleMapDrawerList'
// import GoogleMapTabFlow from '@/navigations/tab/flow/GoogleMapTabFlow'

// const Drawer = createDrawerNavigator()

// export default function GoogleMapDrawerFlow() {
// 	return (
// 		<Drawer.Navigator
// 			backBehavior="history"
// 			initialRouteName="GoogleMapTabFlow"
// 			drawerContent={(props) => <CustomDrawerContent {...props} />}>
// 			<Drawer.Group screenOptions={{ headerShown: false }}>
// 				<Drawer.Screen name="GoogleMapTabFlow" component={GoogleMapTabFlow} />
// 			</Drawer.Group>

// 			<Drawer.Group initialRouteName="GoogleMapScreen">
// 				{googleMapDrawerList.map((menu) => (
// 					<Drawer.Screen key={menu.index} name={menu.name} options={menu.options}>
// 						{(props) => (
// 							<AppContainer
// 								{...props}
// 								Screen={menu.component}
// 								backgroundOption={menu.backgroundOption}></AppContainer>
// 						)}
// 					</Drawer.Screen>
// 				))}
// 			</Drawer.Group>
// 		</Drawer.Navigator>
// 	)
// }
