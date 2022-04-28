import React from 'react'
import Modal from './Modal'
import styled from 'styled-components/native'
import { kakaoMapOpen, nmapOpen, tMapOpen } from '@/map/navigationOpen'
import { GET_FIND_ROAD } from '@/core/store/api/create/stationCreate'
import { useStationContext } from '@/core/store/api/providers/StationApiProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import useGeolocation from '@/hooks/useGeolocation'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { theme } from '@/theme'
import SmallText from '../text/SmallText'

const ModalContainer = styled.View`
	flex: 1;
	justify-content: space-between;
	z-index: 1;
	flex-direction: column;
	justify-content: flex-end;
`

const Feedback = styled.View`
	height: 80%;
`

const ModalWrap = styled.View`
	border-top-left-radius: ${moderateScale(12)}px;
	border-top-right-radius: ${moderateScale(12)}px;
	background-color: ${theme.colors.white};
	padding-bottom: ${verticalScale(20.5)}px;
`

const ModalItemView = styled.Pressable`
	flex-direction: row;
	padding-top: ${verticalScale(24)}px;
	padding-left: ${horizontalScale(20)}px;
	padding-bottom: ${verticalScale(20)}px;
`

const ModalItemImg = styled.Image`
	width: ${moderateScale(20)}px;
	height: ${moderateScale(20)}px;
	margin-right: ${horizontalScale(12)}px;
`

export default function FindRoadModal({ findRoadModal, setFindRoadModal, signConfirm }) {
	const { dispatch: stationDispatch } = useStationContext()
	const {
		userState: { isLoggined },
	} = useUser()
	const { getLocation } = useGeolocation()
	const { $alert } = useAlert()

	async function handlePressNavi(index) {
		if (isLoggined) {
			try {
				const loc = await getLocation()
				if (loc.code === 200) {
					const { latitude, longitude } = loc

					try {
						const response = await GET_FIND_ROAD(stationDispatch, { longitude, latitude })
						const resData = response.data
						setFindRoadModal(false)
						if (resData?.code === 'SUCCESS' && resData?.data) {
							const arrivalData = resData.data

							if (index === 0) {
								try {
									await nmapOpen({
										slat: latitude,
										slng: longitude,
										sname: '내 위치',
										dlat: arrivalData.latitude,
										dlng: arrivalData.longitude,
										dname: arrivalData.name,
										installed: true,
									})
								} catch (error) {
									console.log('naver map open error => ', error)
									if (error.code === 'EUNSPECIFIED') {
										await nmapOpen({
											slat: latitude,
											slng: longitude,
											sname: '내 위치',
											dlat: arrivalData.latitude,
											dlng: arrivalData.longitude,
											dname: arrivalData.name,
											installed: false,
										})
									}
								}
							} else if (index === 1) {
								try {
									await kakaoMapOpen({
										sp: `${latitude},${longitude}`,
										ep: `${arrivalData.latitude},${arrivalData.longitude}`,
										installed: true,
									})
								} catch (error) {
									console.log('kakao navi open error => ', error)
									if (error.code === 'EUNSPECIFIED') {
										await kakaoMapOpen({
											sp: `${latitude},${longitude}`,
											ep: `${arrivalData.latitude},${arrivalData.longitude}`,
											installed: false,
										})
									}
								}
							} else if (index === 2) {
								try {
									await tMapOpen({
										rGoName: arrivalData.name,
										rGoX: arrivalData.longitude,
										rGoY: arrivalData.latitude,
										installed: true,
									})
								} catch (error) {
									console.log('tmap open error => ', error)
									if (error.code === 'EUNSPECIFIED') {
										await tMapOpen({
											rGoName: arrivalData.name,
											rGoX: arrivalData.longitude,
											rGoY: arrivalData.latitude,
											installed: false,
										})
									}
								}
							}
						} else if (resData?.code !== 'SUCCESS' && resData?.msg) {
							setTimeout(() => {
								$alert(resData.msg)
							}, 0)
						}
					} catch (error) {
						setFindRoadModal(false)
						console.log('find arrival error => ', error)
					}
				}
			} catch (error) {
				setFindRoadModal(false)
				console.log('get location error => ', error)
			}
		} else {
			setFindRoadModal(false)
			setTimeout(() => {
				signConfirm()
			}, 200)
		}
	}
	return (
		<Modal.Common
			transparent={true}
			visible={findRoadModal}
			animationType="fade"
			setClose={() => setFindRoadModal(false)}
		>
			<Feedback />
			<ModalContainer>
				<ModalWrap>
					<ModalItemView onPress={() => handlePressNavi(0)}>
						<ModalItemImg source={require('@assets/icons/nmap-mdpi.png')} />
						<SmallText>네이버 지도</SmallText>
					</ModalItemView>
					<ModalItemView onPress={() => handlePressNavi(1)}>
						<ModalItemImg source={require('@assets/icons/kakaomap-mdpi.png')} />
						<SmallText>카카오 네비</SmallText>
					</ModalItemView>
					<ModalItemView onPress={() => handlePressNavi(2)}>
						<ModalItemImg source={require('@assets/icons/tmap-mdpi.png')} />
						<SmallText>T map</SmallText>
					</ModalItemView>
				</ModalWrap>
			</ModalContainer>
		</Modal.Common>
	)
}
