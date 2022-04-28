import Store from '@/core/store'
import RootContainer from '@/navigations/RootContainer'
import React, { useEffect } from 'react'
import 'react-native-gesture-handler'
import { MenuProvider } from 'react-native-popup-menu'
import SplashScreen from 'react-native-splash-screen' /** 스플래쉬 **/

export default function App() {
	useEffect(() => {
		try {
			setTimeout(() => {
				SplashScreen.hide() /** 스플래쉬 **/
			}, 2000)
		} catch (e) {
			console.warn('Splash error => {} ', e)
		}
	})

	return (
		<Store>
			<MenuProvider>
				<RootContainer />
			</MenuProvider>
		</Store>
	)
}
