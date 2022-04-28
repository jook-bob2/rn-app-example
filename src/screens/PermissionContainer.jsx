import React, { useEffect, useState } from 'react'
import messaging from '@react-native-firebase/messaging'
import { Platform, StyleSheet, View } from 'react-native'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import {
	checkMultiple,
	openSettings,
	PERMISSIONS,
	RESULTS,
	requestMultiple,
	requestNotifications,
} from 'react-native-permissions'
import SmallText from '@/components/ui/text/SmallText'
import Checkbox from '@/components/ui/checkbox/Checkbox'
import { storageUtil } from '@/utils/storageUtil'
import styled from 'styled-components/native'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import storageConst from '@/constants/storageConst'
import { navigationRef } from '@/navigations/RootNavigation'
import { PATCH_READ_VALUE } from '@/core/store/api/create/messageCreate'
import { useMessageContext } from '@/core/store/api/providers/MessageApiProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useLoading } from '@/core/store/common/providers/LoadingProvider'
import { MsgTypeCd } from '@/constants/messageTypeConst'
import { useConnector } from '@/core/store/common/providers/ConnectorStatusProvider'
import { theme } from '@/theme'

const { PHONE_PUSH_FLAG, PHOTO_PERMISSION, LOCATION_PERMISSION } = storageConst

const CheckView = styled.View`
	/* padding: ${moderateScale(10)}px; */
	margin-top: ${verticalScale(16)}px;
`

const TextView = styled.View`
	padding-top: ${verticalScale(10)}px;
	padding-left: ${moderateScale(10)}px;
	padding-right: ${moderateScale(10)}px;
`

const CheckBoxImage = styled.Image`
	width: ${moderateScale(15)}px;
	height: ${moderateScale(15)}px;
	tint-color: ${({ tintColor }) => (tintColor ? tintColor : theme.colors.placeholder)};
`

export default function PermissionContainer({ children }) {
	const { $confirm } = useConfirm()
	const { $alert } = useAlert()
	const { dispatch: msgDispatch } = useMessageContext()
	const {
		userState: { isLoggined },
	} = useUser()
	const { hiddenLoading } = useLoading()
	const { getConnStatus, connectorState } = useConnector()

	/*
	 * 앱 실행 시 권한, 알림 여부 체크
	 */
	useEffect(() => {
		onCheckPermission()
		// .then(async () => {
		// 	await onCheckNotification()
		// })
		// .catch((err) => {
		// 	console.log('permission error => ', err)
		// })
	}, [])

	/*
	 * Permission check
	 */
	async function onCheckPermission() {
		if (Platform.OS === 'ios') {
			try {
				const statuses = await checkMultiple([
					// PERMISSIONS.IOS.CAMERA,
					PERMISSIONS.IOS.PHOTO_LIBRARY,
					PERMISSIONS.IOS.LOCATION_ALWAYS,
				])
				// 필수 앱 권한이 허용되지 않은 경우
				if (
					// statuses[PERMISSIONS.IOS.CAMERA] !== RESULTS.GRANTED ||
					statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] !== RESULTS.GRANTED ||
					statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] !== RESULTS.GRANTED
				) {
					setIOSPermissions()
				}
			} catch (e1) {
				console.log('iOS permission check error => ', e1)
			}
		}
		if (Platform.OS === 'android') {
			try {
				const statuses = await checkMultiple([
					// PERMISSIONS.ANDROID.CAMERA,
					PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
					PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
					PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
				])

				// hold: 프로젝트 홀딩으로 개발 중단함.
				if (statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED) {
					storageUtil.setItem({
						key: PHOTO_PERMISSION,
						value: {
							success: true,
							msg: '',
						},
						options: { addYear: 1 },
					})
				}

				// 필수 앱 권한이 허용되지 않은 경우
				if (
					// statuses[PERMISSIONS.ANDROID.CAMERA] !== RESULTS.GRANTED ||
					statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] !== RESULTS.GRANTED ||
					statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] !== RESULTS.GRANTED ||
					statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] !== RESULTS.GRANTED
				) {
					setAndroidPermissions()
				}
			} catch (e1) {
				console.log('Android permission check error => ', e1)
			}
		}
	}

	/*
	 * iOS Permission Setting
	 */
	async function setIOSPermissions() {
		try {
			const photoPermission = await storageUtil.getItem({ key: PHOTO_PERMISSION })
			const locationPermission = await storageUtil.getItem({ key: LOCATION_PERMISSION })

			if (photoPermission?.data?.success === false) {
				// 사진 권한 묻기 2번째 부터 컨펌으로 띄움.
				permissionConfirm(photoPermission.data.msg)
			} else if (locationPermission?.data?.success === false) {
				// 위치 권한 묻기 2번째 부터 컨펌으로 띄움.
				permissionConfirm(locationPermission.data.msg)
			} else {
				try {
					const r2 = await requestMultiple([
						// PERMISSIONS.IOS.CAMERA,
						PERMISSIONS.IOS.PHOTO_LIBRARY,
						PERMISSIONS.IOS.LOCATION_ALWAYS,
					])

					if (r2[PERMISSIONS.IOS.PHOTO_LIBRARY] !== RESULTS.GRANTED) {
						storageUtil.setItem({
							key: PHOTO_PERMISSION,
							value: {
								success: false,
								msg: '사진 권한을 "모든 사진"으로 설정해주세요.\n\n설정 하시겠습니까?',
							},
							options: { addYear: 1 },
						})
					}

					if (r2[PERMISSIONS.IOS.LOCATION_ALWAYS] !== RESULTS.GRANTED) {
						storageUtil.setItem({
							key: LOCATION_PERMISSION,
							value: {
								success: false,
								msg: '위치 권한을 "항상"으로 설정해주세요.\n\n설정 하시겠습니까?',
							},
							options: { addYear: 1 },
						})
					} else {
						onCheckNotification()
					}
				} catch (e2) {
					console.log('iOS permission request error => ', e2)
				}
			}
		} catch (e3) {
			console.log('Permission storage Error => ', e3)
		}
	}

	/*
	 * Android Permission Setting
	 */
	async function setAndroidPermissions() {
		try {
			const photoPermission = await storageUtil.getItem({ key: PHOTO_PERMISSION })
			const locationPermission = await storageUtil.getItem({ key: LOCATION_PERMISSION })

			if (photoPermission?.data?.success === false) {
				// 사진 권한 묻기 2번째 부터 컨펌으로 띄움.
				permissionConfirm(photoPermission.data.msg)
			} else if (locationPermission?.data?.success === false) {
				// 위치 권한 묻기 2번째 부터 컨펌으로 띄움.
				permissionConfirm(locationPermission.data.msg)
			} else {
				// 최초에만 디바이스 시스템 권한 여부 묻기
				try {
					const r3 = await requestMultiple([
						// PERMISSIONS.ANDROID.CAMERA,
						PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
						PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
						PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
					])

					if (r3[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] !== RESULTS.GRANTED) {
						storageUtil.setItem({
							key: PHOTO_PERMISSION,
							value: {
								success: false,
								msg: '저장공간 권한이 허용되지 않았습니다.\n\n설정 하시겠습니까?',
							},
							options: { addYear: 1 },
						})
					}

					if (
						r3[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] !== RESULTS.GRANTED ||
						r3[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] !== RESULTS.GRANTED
					) {
						storageUtil.setItem({
							key: LOCATION_PERMISSION,
							value: {
								success: false,
								msg: '위치 권한이 허용되지 않았습니다.\n\n설정 하시겠습니까?',
							},
							options: { addYear: 1 },
						})
					}
				} catch (e3) {
					console.log('Android permission request error => ', e3)
				}
			}
		} catch (e2) {
			console.log('Permission storage error => ', e2)
		}
	}

	/*
	 * 권한 컨펌
	 */
	function permissionConfirm(msg) {
		setTimeout(() => {
			$confirm({
				msg: () => {
					return (
						<View>
							<TextView>
								<SmallText style={styles.textAlign}>{msg}</SmallText>
							</TextView>
						</View>
					)
				},
				confirmButtonName: '설정 하러가기',
				cancelButtonName: '취소',
				onPress: (r2) => {
					r2 ? openSettings() : null
				},
			})
		}, 1000)
	}

	/*
	 * Notification confirm Setting
	 */
	function confirmNotification() {
		setTimeout(() => {
			$confirm({
				msg: () => {
					const [checked, setChecked] = useState(false)
					return (
						<View>
							<TextView>
								<SmallText style={styles.textAlign}>
									{'핸드폰 푸시알림이 허용되지 않았습니다.\n\n설정 하시겠습니까?'}
								</SmallText>
							</TextView>
							<CheckView>
								<Checkbox
									checked={checked}
									label={<SmallText style={styles.label}>다시 묻지 않음</SmallText>}
									onPress={() => {
										storageUtil.setItem({
											key: PHONE_PUSH_FLAG,
											value: !checked,
											options: { addYear: 1 },
										})
										setChecked(!checked)
									}}
									checkStyle={styles.checkBox}
									uncheckStyle={styles.checkBox}
									customTrueImage={
										<CheckBoxImage
											source={require('@assets/icons/check.png')}
											tintColor={theme.colors.turquoise}
										/>
									}
									customFalseImage={
										<CheckBoxImage
											source={require('@assets/icons/check.png')}
											tintColor={theme.colors.disabled}
										/>
									}
								/>
							</CheckView>
						</View>
					)
				},
				confirmButtonName: '설정 하러가기',
				cancelButtonName: '취소',
				onPress: (r3) => {
					r3
						? openSettings()
						: Platform.OS === 'ios'
						? setIOSPermissions()
						: Platform.OS === 'android'
						? setAndroidPermissions()
						: null
				},
			})
		}, 1000)
	}

	/*
	 * Notification check
	 */
	async function onCheckNotification() {
		try {
			const enabled = await messaging().hasPermission()
			if (
				enabled === messaging.AuthorizationStatus.AUTHORIZED ||
				enabled === messaging.AuthorizationStatus.PROVISIONAL
			) {
				onCreateFcmHandler()
			} else {
				try {
					const r1 = await requestNotifications(['alert', 'badge', 'sound'])
					const r2 = await storageUtil.getItem({ key: PHONE_PUSH_FLAG })
					const isPush = r2?.data
					// 허용한 경우
					if (r1.status === RESULTS.GRANTED) onCreateFcmHandler()

					// 알림을 허용하지 않았을 경우
					if (r1.status !== RESULTS.GRANTED) {
						if (!isPush) {
							confirmNotification()
						}
					}
				} catch (e2) {
					console.log('Notification request permission err => ', e2)
				}
			}
		} catch (e1) {
			console.log('Notification hasPermission error => ', e1)
		}
	}

	// background에서 앱을 오픈했을 때
	function onBackgroundMessage() {
		messaging().onNotificationOpenedApp((remoteMessage) => {
			console.info('Opened forwarded message in the background!: ')
			// navigation.navigate(remoteMessage.data.type)
			const data = remoteMessage.data
			const flow = data.flow
			const screen = data.screen
			const params = data?.params ? JSON.parse(data.params) : null

			console.log('백그라운드 메시지 데이터 => ', params)

			patchReadValue(params.messageId)
			// const title = remoteMessage.notification.title
			// const body = remoteMessage.notification.body
			navigationRef.current?.navigate(flow, { screen, params })
		})
	}

	// 종료 상태에서 애플리케이션을 연 경우.
	async function onExitMessage() {
		messaging()
			.getInitialNotification()
			.then((remoteMessage) => {
				if (remoteMessage) {
					console.info('Messages delivered while the app is exit!')
					const data = remoteMessage.data
					const flow = data.flow
					const screen = data.screen
					const params = data?.params ? JSON.parse(data.params) : null

					console.log('종료상태 메시지 데이터 => ', params)

					patchReadValue(params.messageId)
					// const title = remoteMessage.notification.title
					// const body = remoteMessage.notification.body
					navigationRef.current?.navigate(flow, { screen, params })
				}
			})
	}

	// foreground에서 받은 메시지 처리
	function onForegroundMessage() {
		messaging().onMessage(async (remoteMessage) => {
			console.info('A new FCM message arrived!')
			const data = remoteMessage.data
			const flow = data.flow
			const screen = data.screen
			const params = data?.params ? JSON.parse(data.params) : null
			const title = remoteMessage.notification.title
			const body = remoteMessage.notification.body

			console.log('========================================================')
			console.log('===================== Message : ', remoteMessage, '===================')
			console.log('========================================================')

			hiddenLoading()

			patchReadValue(params.messageId)

			if (params?.messageTypCd === MsgTypeCd.RETURN_QUEUE && connectorState.status === 2) {
				// 대기열 상태이면서 메시지타입이 RETURN_QUEUE 일경우
				getConnStatus(true)
			}

			navigationRef.current?.navigate(flow, { screen, params })

			setTimeout(() => {
				$alert({
					title,
					msg: body,
				})
			}, 200)
		})
	}

	// FCM Handler 생성
	async function onCreateFcmHandler() {
		onBackgroundMessage()
		onExitMessage()
		onForegroundMessage()
	}

	async function patchReadValue(messageId) {
		if (isLoggined) {
			try {
				await PATCH_READ_VALUE(msgDispatch, { id: messageId })
			} catch (error) {
				console.log('patch read value error => ', error)
			}
		}
	}

	return <>{children}</>
}

const styles = StyleSheet.create({
	label: {
		marginLeft: horizontalScale(6),
		alignSelf: 'center',
	},
	textAlign: {
		textAlign: 'left',
	},
	checkBox: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		borderRadius: moderateScale(15),
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(1),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(0.5),
		elevation: 3,
		padding: moderateScale(5),
	},
})
