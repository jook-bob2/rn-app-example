import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { UserStateContext } from '@store/common/create'
import { userInitialState } from '@store/common/initialState'
import { userReducer } from '@store/common/reducer'
import { constants } from '@store/common/constants'
import { storageUtil } from '@util/storageUtil'
import { setAxiosHeader } from '@/core/config/axios'
import { postSilentRefresh } from '@/core/api/userApi'
import { postSignInHist } from '@/core/api/userHistoryApi'
import userConst from '@/constants/userConst'
import storageConst from '@/constants/storageConst'
import useGeolocation from '@/hooks/useGeolocation'
import useLocPermission from '@/hooks/useLocPermission'
import { getIpAddress, getUserAgent } from 'react-native-device-info'

const { AUTHORIZATION } = userConst
const { SET_ADD_USER, SET_INIT_USER } = constants
const { USER_INFO, USING_USER_LIST } = storageConst
const JWT_EXPIRY_TIME = 1000 * 60 * 60 // 만료 시간 (1시간)
let timeout // 타임아웃 담는 변수

export function UserProvider({ children }) {
	const [userState, userDispatch] = useReducer(userReducer, userInitialState)
	const [userListLoading, setUserListLoading] = useState(false)
	const timerId = useRef(null)
	const { onCheckLocationPermission } = useLocPermission()
	const { getLocation } = useGeolocation()

	/*
	 * 자동 로그인인지 확인 후 로그인 시키기
	 */
	useEffect(() => {
		// 저장소에 유저 정보가 있으면 정보를 셋팅
		storageUtil
			.getItem({ key: USER_INFO })
			.then((result) => {
				if (result?.data) {
					const data = result.data
					// if (data.autoSign && new Date(result.expiration) > new Date()) {
					// 	// 자동 로그인 상태이면서 유저 정보가 만료되지 않은 경우
					// 	onLoginSuccess(data)
					// } else {
					// 	// 자동 로그인이 아니면서 유저 정보가 만료된 경우
					// 	onLogoutSuccess()
					// }
					if (data) onLoginSuccess(data)
				}
			})
			.catch((err) => {
				console.log('저장소에 유저 정보가 없습니다. => ', err)
			})
	}, [])

	/*
	 * 새로운 토큰 발급
	 */
	async function onSilentRefresh({ accessToken, refreshToken, id, autoSign }, isTimer) {
		try {
			const response = await postSilentRefresh({ id, accessToken, refreshToken })
			console.info('유저의 새로운 정보가 발급 되었습니다.')
			if (isTimer) {
				await onLoginSuccess({ ...response.data, autoSign })
			}
		} catch (error) {
			heartbeatUser({ accessToken, refreshToken, id, autoSign })
			console.log('on silent refresh error ==> ', error)
		}
	}

	/*
	 * 로그인 성공 시 데이터 셋팅
	 */
	async function onLoginSuccess({
		id,
		defaultUserEvId,
		email,
		userTypeCd,
		pinFlag,
		accessToken,
		refreshToken,
		name,
		autoSign,
	}) {
		const data = { id, defaultUserEvId, email, userTypeCd, pinFlag, accessToken, refreshToken, name, autoSign }

		if (timerId.current) {
			clearInterval(timerId.current)
		}

		setUserInfo(data)
		setAxiosHeader({ key: AUTHORIZATION, value: accessToken })

		try {
			const r1 = await storageUtil.setItem({
				key: USER_INFO,
				value: data,
				options: { addYear: 1 },
			})

			if (r1) {
				const r2 = await addUserList(data)
				if (r2 === true) {
					console.info('login success')
					// 자동 로그인이 true인경우 자동 연장 진행
					onSilentRefresh({ accessToken, id, refreshToken, autoSign }, false)

					// accessToken 만료하기 1분 전에 로그인 연장
					timeout = setTimeout(() => {
						onSilentRefresh({ accessToken, id, refreshToken, autoSign }, true)
					}, JWT_EXPIRY_TIME - 60000)

					return true
				}
			}
		} catch (error) {
			console.log('login error', error)
		}
	}

	/*
	 * 로그아웃 성공 시 데이터 제거
	 */
	async function onLogoutSuccess() {
		try {
			const isClear = await initUserInfo()
			if (isClear) {
				removeRefresh()
				console.info('logout success')
				return true
			}
		} catch (error) {
			console.log('User info remove error => ', error)
		}
	}

	function removeRefresh() {
		if (timeout) clearTimeout(timeout)
	}

	/*
	 * 유저 정보 셋팅
	 */
	function setUserInfo({
		id,
		defaultUserEvId,
		email,
		userTypeCd,
		pinFlag,
		accessToken,
		refreshToken,
		name,
		autoSign,
	}) {
		userDispatch({
			type: SET_ADD_USER,
			payload: {
				id,
				defaultUserEvId,
				email,
				userTypeCd,
				pinFlag,
				accessToken,
				refreshToken,
				isLoggined: true,
				name,
				autoSign,
			},
		})
	}

	/*
	 * 유저 정보 초기화
	 */
	async function initUserInfo() {
		try {
			const isRemove = await storageUtil.removeItem({ key: USER_INFO })
			if (isRemove === true) {
				userDispatch({
					type: SET_INIT_USER,
				})

				const isEmptyList = await storageUtil.removeItem({ key: USING_USER_LIST })

				if (isEmptyList) {
					return true
				}
			}
		} catch (error) {
			console.log('initial user info error => ', error)
		}
	}

	/*
	 * 계정 추가
	 */
	async function addUserList({ id, email, userTypeCd, accessToken, defaultUserEvId, refreshToken, name, autoSign }) {
		const data = { id, email, userTypeCd, accessToken, refreshToken, name, autoSign, defaultUserEvId }
		setUserListLoading(true)

		try {
			const r1 = await storageUtil.getItem({ key: USING_USER_LIST })
			const userList = r1?.data
			if (userList?.length > 0) {
				for (const u of userList) {
					if (u.userTypeCd === userTypeCd) {
						// 로그인하려는 유저 타입이 리스트에 있는 경우
						// 교체 해준다.
						const differentUser = userList.filter((u2) => u2.userTypeCd !== userTypeCd)[0]
						const newUser = { ...data, selected: true }
						const resultArr = []

						if (differentUser) {
							resultArr.push({ ...differentUser, selected: false })
							resultArr.push(newUser)
						} else {
							resultArr.push(newUser)
						}

						const result = await storageUtil.setItem({
							key: USING_USER_LIST,
							value: resultArr,
							options: {
								addYear: 1,
							},
						})

						if (result.length > 0) {
							setUserListLoading(false)
							return true
						}
					} else {
						// 로그인하려는 유저 타입이 리스트에 없는 경우
						// 현재 리스트에 데이터를 추가해준다.
						const result = await storageUtil.setItem({
							key: USING_USER_LIST,
							value: [
								{ ...u, selected: false },
								{ ...data, selected: true },
							],
							options: { addYear: 1 },
						})

						if (result.length > 0) {
							setUserListLoading(false)
							return true
						}
					}
				}
			} else if (!r1) {
				// 로그인 한 적이 없는 경우
				const result = await storageUtil.setItem({
					key: USING_USER_LIST,
					value: [{ ...data, selected: true }],
					options: { addYear: 1 },
				})

				if (result.length > 0) {
					setUserListLoading(false)
					return true
				}
			}
		} catch (error) {
			console.log('err', error)
		}
	}

	/*
	 * 서버가 죽었을 때 살리기
	 */
	function heartbeatUser({ accessToken, refreshToken, id, autoSign }) {
		userDispatch({
			type: SET_INIT_USER,
		})

		if (!timerId.current) {
			timerId.current = setInterval(() => {
				console.log('===================== Heart beat ========================')
				onSilentRefresh({ accessToken, refreshToken, id, autoSign }, true)
			}, 3000)
		}
	}

	/*
	 * 로그인 이력 저장
	 */
	async function saveSignInHistory(userId) {
		const result = await onCheckLocationPermission()
		const returnData = { success: false, msg: '' }

		if (result === true) {
			const location = await getLocation()
			if (location.code === 200) {
				const remoteAddr = await getIpAddress()
				const userAgent = await getUserAgent()

				if (remoteAddr && userAgent && location && userId) {
					try {
						const r2 = await postSignInHist({
							latitude: location.latitude,
							longitude: location.longitude,
							userId,
							remoteAddr,
							userAgent,
						})

						const r2Data = r2
						if (r2Data.code === 'SUCCESS') {
							console.log('유저 히스토리가 저장되었습니다.')
							returnData.success = true
							returnData.msg = r2Data.msg
						} else if (r2Data.code === 'ESVC051') {
							// $alert('GPS 검색 중 오류가 발생 했습니다.')
							returnData.success = false
							returnData.msg = r2Data.msg
						} else if (r2Data.code === 'ESVC009') {
							// $alert('로그인 중 오류가 발생 했습니다.')
							returnData.success = false
							returnData.msg = '로그인 중 오류가 발생 했습니다.'
						}
					} catch (e2) {
						console.log('user history save error => ', e2)
					}
				}
			}
		}

		return new Promise((resolve) => {
			resolve(returnData)
		})
	}

	return (
		<UserStateContext.Provider
			value={{
				userState,
				userDispatch,
				setUserInfo,
				initUserInfo,
				onLoginSuccess,
				onLogoutSuccess,
				removeRefresh,
				userListLoading,
				saveSignInHistory,
			}}
		>
			{children}
		</UserStateContext.Provider>
	)
}

export function useUser() {
	const {
		userState,
		userDispatch,
		setUserInfo,
		initUserInfo,
		onLoginSuccess,
		onLogoutSuccess,
		removeRefresh,
		userListLoading,
		saveSignInHistory,
	} = useContext(UserStateContext)
	if (!userState) {
		throw new Error('Cannot find UserState')
	}
	return {
		userState,
		userDispatch,
		setUserInfo,
		initUserInfo,
		onLoginSuccess,
		onLogoutSuccess,
		removeRefresh,
		userListLoading,
		saveSignInHistory,
	}
}
