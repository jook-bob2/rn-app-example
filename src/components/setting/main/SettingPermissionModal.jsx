// import Modal from '@/components/ui/modal/Modal'
// import Switch from '@/components/ui/Switch'
// import Paragraph from '@/components/ui/text/Paragraph'
// import Subtitle from '@/components/ui/text/Subtitle'
// import Left from '@/components/ui/view/Left'
// import Right from '@/components/ui/view/Right'
// import { theme } from '@/theme'
// import React, { useCallback, useState } from 'react'
// import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
// import styled from 'styled-components/native'
// import { PERMISSIONS, RESULTS, request, checkMultiple, openSettings } from 'react-native-permissions'
// import { useFocusEffect } from '@react-navigation/core'
// import SmallText from '@/components/ui/text/SmallText'
// import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'

// const Container = styled.View`
// 	flex: 1;
// 	z-index: 1;
// 	margin: ${moderateScale(25)}px;
// `

// const Feedback = styled.View`
// 	height: 33%;
// `

// const Wrap = styled.View`
// 	border-radius: ${moderateScale(33)}px;
// 	background-color: ${theme.colors.white};
// `

// const TitleView = styled.View`
// 	padding: ${moderateScale(10)}px;
// 	margin: 0px ${horizontalScale(10)}px;
// 	align-items: center;
// 	border-bottom-width: ${horizontalScale(1)}px;
// 	border-bottom-color: ${theme.colors.darkGray};
// `

// const ItemView = styled.View`
// 	flex-direction: row;
// 	align-items: center;
// 	justify-content: space-between;
// 	padding: ${verticalScale(12)}px ${horizontalScale(30)}px;
// `

// export default function SettingPermissionModal({ isPermissionOpen, setIsPermissionOpen }) {
// 	const [camera, setCamera] = useState(false)
// 	const [storage, setStorage] = useState(false)
// 	const [location, setLocation] = useState(false)

// 	useFocusEffect(
// 		useCallback(() => {
// 			if (Platform.OS === 'ios') {
// 				checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY, PERMISSIONS.IOS.LOCATION_ALWAYS])
// 					.then((statuses) => {
// 						console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA])
// 						console.log('Photo', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY])
// 						console.log('Location', statuses[PERMISSIONS.IOS.LOCATION_ALWAYS])
// 						if (statuses[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED) setCamera(true)
// 						if (statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] === RESULTS.GRANTED) setStorage(true)
// 						if (statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.GRANTED) setLocation(true)
// 					})
// 					.catch((err) => {
// 						console.log('iOS permission error => ', err)
// 					})
// 			}
// 			if (Platform.OS === 'android') {
// 				checkMultiple([
// 					PERMISSIONS.ANDROID.CAMERA,
// 					PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
// 					PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
// 				])
// 					.then((statuses) => {
// 						console.log('Camera', statuses[PERMISSIONS.ANDROID.CAMERA])
// 						console.log('Photo', statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE])
// 						console.log('Location', statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION])
// 						if (statuses[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED) setCamera(true)
// 						if (statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED) setStorage(true)
// 						if (statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED) setLocation(true)
// 					})
// 					.catch((err) => {
// 						console.log('Android permission error => ', err)
// 					})
// 			}
// 		}, []),
// 	)

// 	const askCameraPermission = async () => {
// 		if (Platform.OS === 'ios') {
// 			try {
// 				const result = await request(PERMISSIONS.IOS.CAMERA)
// 				console.log('Camera result ==> ', result)
// 				if (result === RESULTS.GRANTED) {
// 					// do something
// 					setCamera(true)
// 				} else {
// 					setCamera(false)
// 				}
// 			} catch (error) {
// 				console.log('askPermission', error)
// 			}
// 		} else if (Platform.OS === 'android') {
// 			try {
// 				const result = await request(PERMISSIONS.ANDROID.CAMERA)
// 				console.log('Camera result ==> ', result)
// 				if (result === RESULTS.GRANTED) {
// 					// do something
// 					setCamera(true)
// 				} else {
// 					setCamera(false)
// 				}
// 			} catch (error) {
// 				console.log('askPermission', error)
// 			}
// 		}
// 	}

// 	const askStoragePermission = async () => {
// 		if (Platform.OS === 'ios') {
// 			try {
// 				const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
// 				console.log('Storage result ==> ', result)
// 				if (result === RESULTS.GRANTED) {
// 					// do something
// 					setStorage(true)
// 				} else {
// 					setStorage(false)
// 				}
// 			} catch (error) {
// 				console.log('askPermission', error)
// 			}
// 		} else if (Platform.OS === 'android') {
// 			try {
// 				const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
// 				console.log('Storage result ==> ', result)
// 				if (result === RESULTS.GRANTED) {
// 					// do something
// 					setStorage(true)
// 				} else {
// 					setStorage(false)
// 				}
// 			} catch (error) {
// 				console.log('askPermission', error)
// 			}
// 		}
// 	}

// 	const askLocationAlwaysPermission = async () => {
// 		if (Platform.OS === 'ios') {
// 			try {
// 				const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS)
// 				console.log('Location result ==> ', result)
// 				if (result === RESULTS.GRANTED) {
// 					// do something
// 					setLocation(true)
// 				} else {
// 					setLocation(false)
// 				}
// 			} catch (error) {
// 				console.log('askPermission', error)
// 			}
// 		} else if (Platform.OS === 'android') {
// 			try {
// 				const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
// 				console.log('Location result ==> ', result)
// 				if (result === RESULTS.GRANTED) {
// 					// do something
// 					setLocation(true)
// 				} else {
// 					setLocation(false)
// 				}
// 			} catch (error) {
// 				console.log('askPermission', error)
// 			}
// 		}
// 	}

// 	return (
// 		<Modal.Common
// 			transparent={true}
// 			visible={isPermissionOpen}
// 			setClose={() => setIsPermissionOpen(false)}
// 			animationType="fade"
// 		>
// 			<Feedback />
// 			<Container>
// 				<Wrap>
// 					<TitleView>
// 						<Subtitle>개인정보 권한설정</Subtitle>
// 					</TitleView>
// 					<ItemView>
// 						<Left>
// 							<Paragraph style={styles.itemText}>카메라 권한</Paragraph>
// 						</Left>
// 						<Right>
// 							<Switch
// 								isSwitchOn={camera}
// 								onSelectSwitch={askCameraPermission}
// 								selectionColor={theme.colors.turquoise}
// 								disabledColor={theme.colors.disabled}
// 							/>
// 						</Right>
// 					</ItemView>
// 					<ItemView>
// 						<Left>
// 							<Paragraph style={styles.itemText}>저장소 권한</Paragraph>
// 						</Left>
// 						<Right>
// 							<Switch
// 								isSwitchOn={storage}
// 								onSelectSwitch={askStoragePermission}
// 								selectionColor={theme.colors.turquoise}
// 								disabledColor={theme.colors.disabled}
// 							/>
// 						</Right>
// 					</ItemView>
// 					<ItemView>
// 						<Left>
// 							<Paragraph style={styles.itemText}>위치 권한</Paragraph>
// 						</Left>
// 						<Right>
// 							<Switch
// 								isSwitchOn={location}
// 								onSelectSwitch={askLocationAlwaysPermission}
// 								selectionColor={theme.colors.turquoise}
// 								disabledColor={theme.colors.disabled}
// 							/>
// 						</Right>
// 					</ItemView>
// 					<ItemView>
// 						<Left>
// 							<Paragraph style={styles.itemText}>앱 설정</Paragraph>
// 						</Left>
// 						<Right>
// 							<TouchableOpacity style={styles.button} onPress={() => openSettings()}>
// 								<SmallText style={styles.whiteText}>열기</SmallText>
// 							</TouchableOpacity>
// 						</Right>
// 					</ItemView>
// 				</Wrap>
// 			</Container>
// 			<Feedback />
// 		</Modal.Common>
// 	)
// }

// const styles = StyleSheet.create({
// 	itemText: {
// 		color: theme.colors.darkGray,
// 	},
// 	button: {
// 		borderRadius: moderateScale(18),
// 		paddingTop: verticalScale(4),
// 		paddingBottom: verticalScale(4),
// 		paddingRight: horizontalScale(14),
// 		paddingLeft: horizontalScale(14),
// 		backgroundColor: theme.colors.turquoise,
// 		borderBottomWidth: verticalScale(1),
// 		borderBottomColor: theme.colors.disabled,
// 		shadowColor: '#000',
// 		shadowOffset: {
// 			width: 0,
// 			height: verticalScale(5),
// 		},
// 		shadowOpacity: 0.29,
// 		shadowRadius: moderateScale(4.65),
// 		elevation: 3,
// 	},
// 	whiteText: {
// 		color: theme.colors.white,
// 	},
// })
