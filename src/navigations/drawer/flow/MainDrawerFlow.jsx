// import React from 'react'
// import { createDrawerNavigator } from '@react-navigation/drawer'
// import CustomDrawerContent from '../content/CustomDrawerContent'
// import mainDrawerList from '../drawerList/mainDrawerList'
// import AppContainer from '@/screens/AppContainer'
// import MainTabFlow from '@/navigations/tab/flow/MainTabFlow'
// import movieDrawerList from '../drawerList/movieDrawerList'

// const Drawer = createDrawerNavigator()

// export default function MainDrawerFlow() {
// 	return (
// 		<Drawer.Navigator
// 			backBehavior="history"
// 			initialRouteName="MainTabFlow"
// 			drawerContent={(props) => <CustomDrawerContent {...props} />}>
// 			<Drawer.Group screenOptions={{ headerShown: false }}>
// 				<Drawer.Screen name="MainTabFlow" component={MainTabFlow} />
// 			</Drawer.Group>

// 			<Drawer.Group initialRouteName="MainScreen">
// 				{mainDrawerList.map((menu) => (
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

// 			<Drawer.Group initialRouteName="BoxOfficeListScreen">
// 				{movieDrawerList.map((menu) => (
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
