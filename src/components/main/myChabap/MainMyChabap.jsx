import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MainMyChabapCharging from './charging/MainMyChabapCharging'
import MainMyChabapStandbyComingSoon from './standbyComingSoon/MainMyChabapStandbyComingSoon'
import MainMyChabapStandbyRegistration from './standbyRegistration/MainMyChabapStandbyRegistration'
import MainMyChabapUncharged from './uncharged/MainMyChabapUncharged'
import MainMyChabapUnsigned from './unsigned/MainMyChabapUnsigned'
import styled from 'styled-components/native'
import { AppState } from 'react-native'
import { theme } from '@/theme'
import { useConnector } from '@/core/store/common/providers/ConnectorStatusProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import { useUserEvContext } from '@/core/store/api/providers/UserEvApiProvider'
import { useFocusEffect } from '@react-navigation/core'

const QueueContainer = styled.View`
	background-color: ${theme.colors.white};
	border-width: ${verticalScale(1)}px;
	border-radius: ${moderateScale(10)}px;
	border-color: ${theme.colors.background};
`

const Contents = styled.View``

const ButtonView = styled.View`
	align-items: center;
	padding-left: ${horizontalScale(16)}px;
	padding-right: ${horizontalScale(16)}px;
	padding-bottom: ${verticalScale(16)}px;
`

const parents = { Contents, ButtonView }

export default function MainMyChabap({ status, carValue, setCarValue, getUserEvList }) {
	const appState = useRef(AppState.currentState)
	const [appStateVisible, setAppStateVisible] = useState(appState.current)
	const { getConnStatus } = useConnector()
	const { userState } = useUser()
	const { state: evState } = useUserEvContext()
	const [isAvailable, setIsAvailable] = useState(false)
	const { data: userEvListData } = evState.userEvList
	const evList = userEvListData?.data || []
	const carSelectModalData = { setCarValue, carValue, getUserEvList, evList }

	// const { landscape } = useDeviceOrientation()

	// console.log(landscape)

	// 앱 상태 체크
	useEffect(() => {
		const subscription = AppState.addEventListener('change', (nextAppState) => {
			if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
				console.log('App has come to the foreground!')
			}

			appState.current = nextAppState
			setAppStateVisible(appState.current)
			console.log('AppState', appState.current)
		})

		return () => {
			subscription.remove()
		}
	}, [])

	useEffect(() => {
		if (appStateVisible === 'active') {
			getConnStatus(true)
		}
	}, [appStateVisible])

	useEffect(() => {
		setDefaultValue()
	}, [evList])

	useFocusEffect(
		useCallback(() => {
			if (status > 0) {
				getUserEvList()
			}
		}, [status]),
	)

	function setDefaultValue() {
		if (evList?.length > 0) {
			let value, userEvId

			for (const ev of evList) {
				if (ev.defaultFlag === 'Y') {
					value = ev.nickname
					userEvId = ev.userEvId
				}
			}
			if (value && userEvId) {
				setCarValue({
					value: value,
					userEvId: userEvId,
				})
			} else {
				setCarValue({
					value: evList[0].nickname ? evList[0].nickname : evList[0].carNum,
					userEvId: evList[0].userEvId,
				})
			}
		}
	}

	return (
		<>
			{status === 0 ? (
				<MainMyChabapUnsigned />
			) : status === 1 ? (
				<>
					{userState.defaultUserEvId ? (
						<QueueContainer>
							<MainMyChabapUncharged parents={parents} carSelectModalData={carSelectModalData} />
						</QueueContainer>
					) : (
						<MainMyChabapUncharged parents={parents} carSelectModalData={carSelectModalData} />
					)}
				</>
			) : status === 2 ? (
				<QueueContainer>
					<MainMyChabapStandbyRegistration
						// 대기열 순번 등록 상태
						parents={parents}
						appStateVisible={appStateVisible}
						carSelectModalData={carSelectModalData}
					/>
				</QueueContainer>
			) : status === 3 ? (
				<QueueContainer>
					<MainMyChabapStandbyComingSoon
						// 대기열 순번 돌아 왔을 때 상태
						parents={parents}
						appStateVisible={appStateVisible}
						setIsAvailable={setIsAvailable}
						isAvailable={isAvailable}
						carSelectModalData={carSelectModalData}
					/>
				</QueueContainer>
			) : status === 4 ? (
				<QueueContainer>
					<MainMyChabapCharging
						// 충전 중 상태
						parents={parents}
						appStateVisible={appStateVisible}
						carSelectModalData={carSelectModalData}
					/>
				</QueueContainer>
			) : null}
		</>
	)
}
