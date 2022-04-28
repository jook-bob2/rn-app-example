// import React from 'react'
// import { createDrawerNavigator } from '@react-navigation/drawer'
// import CustomDrawerContent from '../content/CustomDrawerContent'
// import AppContainer from '@/screens/AppContainer'
// import movieDrawerList from '../drawerList/movieDrawerList'
// import MainTabFlow from '@/navigations/tab/flow/MainTabFlow'

// const Drawer = createDrawerNavigator()

// export default function MovieDrawerFlow() {
// 	return (
// 		<Drawer.Navigator
// 			backBehavior="history"
// 			initialRouteName="BoxOfficeListScreen"
// 			drawerContent={(props) => <CustomDrawerContent {...props} />}>
// 			<Drawer.Group screenOptions={{ headerShown: false }}>
// 				<Drawer.Screen name="MainTabFlow" component={MainTabFlow} />
// 			</Drawer.Group>

// 			<Drawer.Group>
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
