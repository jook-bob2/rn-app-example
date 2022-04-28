import React, { useContext, useEffect, useReducer } from 'react'
import { DeviceStateContext } from '@store/common/create'
import { deviceInitialState } from '@store/common/initialState'
import { deviceReducer } from '@store/common/reducer'
import { constants } from '@store/common/constants'
import analytics from '@react-native-firebase/analytics'
import messaging from '@react-native-firebase/messaging'
import { useUser } from './UserProvider'
import { postSaveUserToken } from '@/core/api/userTokenApi'
import { useAlert } from './AlertProvider'

const { SET_ADD_DEVICE, SET_INIT_DEVICE } = constants

export function DeviceProvider({ children }) {
	const [deviceState, deviceDispatch] = useReducer(deviceReducer, deviceInitialState)
	const { userState } = useUser()
	const { $alert } = useAlert()

	/*
	 * 로그인 된 경우 디바이스 토큰 발급
	 */
	useEffect(() => {
		if (userState.isLoggined) {
			getFcmToken()

			return messaging().onTokenRefresh(async (newToken) => {
				if (userState.isLoggined) {
					console.log('================== FCM token refresh ready ==============')
					const newInstanceId = await getInstanceId()

					try {
						const result = await postSaveUserToken({
							token: newToken,
							instanceId: newInstanceId,
							userId: userState.id,
							delFlag: 'N',
						})

						const resData = result.data
						const code = result.code
						const msg = result.msg

						if (code === 'SUCCESS' && resData === true) {
							console.log('================== FCM token refresh complete ==============')
							setDeviceInfo({ fcmToken: newToken, instanceId: newInstanceId, userId: userState.id })
						} else {
							$alert(msg)
						}
					} catch (error) {
						console.log('FCM token save error =>', error)
					}
				}
			})
		}

		initDeviceInfo()
	}, [userState])

	/*
	 * 디바이스 정보 셋팅
	 */
	function setDeviceInfo({ fcmToken, instanceId, userId }) {
		deviceDispatch({
			type: SET_ADD_DEVICE,
			payload: { fcmToken, instanceId, userId },
		})
	}

	/*
	 * 디바이스 정보 초기화
	 */
	function initDeviceInfo() {
		deviceDispatch({
			type: SET_INIT_DEVICE,
		})
	}

	/*
	 * FCM token 가져오기
	 */
	async function getFcmToken() {
		const oldToken = await messaging().getToken()
		await messaging().deleteToken()
		const newToken = await messaging().getToken()
		if (oldToken === newToken) {
			console.error('Token has not been refreshed')
		}
		return newToken
	}

	/*
	 * Instance ID 가져오기
	 */
	async function getInstanceId() {
		return await analytics().getAppInstanceId()
	}

	return (
		<DeviceStateContext.Provider value={{ deviceState, deviceDispatch, setDeviceInfo, initDeviceInfo }}>
			{children}
		</DeviceStateContext.Provider>
	)
}

export function useDevice() {
	const { deviceState, deviceDispatch, setDeviceInfo, initDeviceInfo } = useContext(DeviceStateContext)
	if (!deviceState) {
		throw new Error('Cannot find DeviceState')
	}
	return { deviceState, deviceDispatch, setDeviceInfo, initDeviceInfo }
}
