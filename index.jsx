/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './App'
import { name as chabap } from './app.json'
import messaging from '@react-native-firebase/messaging'

/*
 * background 푸시 알림 처리
 * 앱이 꺼져 있는 상태에서도 동작하는 리스너이다.
 */
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
	console.log('Message handled in the background!')
	// const data = remoteMessage.data
	// const flow = data.flow
	// const screen = data.screen
	// const params = data.params
	// const title = remoteMessage.notification.title
	// const body = remoteMessage.notification.body
	// console.log('flow => ', flow)
	// console.log('screen => ', screen)
	// console.log('params => ', params)
	// console.log('title => ', title)
	// console.log('body => ', body)
})

AppRegistry.registerComponent(chabap, () => App)
