import React, { useCallback } from 'react'
import { useUserEvContext } from '@/core/store/api/providers/UserEvApiProvider'
import { useFocusEffect } from '@react-navigation/core'
import { GET_USER_EV_LIST } from '@/core/store/api/create/userEvCreate'
import styled from 'styled-components/native'
import { theme } from '@/theme'
import { StyleSheet, View } from 'react-native'
import SmallText from '../ui/text/SmallText'
import Paragraph from '@/components/ui/text/Paragraph'
import Button from '@/components/ui/button/Button'
import constants from '@/navigations/constants'
import { useNavigation } from '@react-navigation/core'
import { verticalScale, horizontalScale, moderateScale } from '@theme/scaling'
import Loading from '@component/ui/Loading'

const Container = styled.View`
	flex: 1;
	padding: ${moderateScale(25)}px;
`

const Wrap = styled.View`
	flex: 1;
`

const Header = styled.View`
	flex: 0.1;
	align-items: center;
	justify-content: flex-start;
`

const ScrollView = styled.ScrollView`
	flex: 0.9;
`

const EmptyView = styled.View`
	flex: 0.9;
	align-items: center;
	justify-content: center;
`

const Contents = styled.TouchableOpacity`
	flex: 1;
	background-color: ${theme.colors.white};
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(22)}px;
	border-color: ${theme.colors.disabled};
	margin: ${verticalScale(3)}px ${horizontalScale(2.5)}px;
	padding: ${moderateScale(15)}px;
`

const { SEARCH_TAB_FLOW, CHARGING_STATION_SEARCH_SCREEN } = constants

export default function ChargingCarSelect() {
	const { state, dispatch } = useUserEvContext()
	const { data: userEvListData, loading, error } = state.userEvList
	const { navigate } = useNavigation()

	useFocusEffect(
		useCallback(() => {
			getUserEvList()
		}, []),
	)

	async function getUserEvList() {
		try {
			await GET_USER_EV_LIST(dispatch)
		} catch (e) {
			console.log(e)
		}
	}

	// console.log(userEvListData)

	if (error) return <Paragraph>{error}</Paragraph>

	return (
		<>
			{loading && !userEvListData && <Loading />}

			<Container>
				<Wrap>
					<Header>
						{userEvListData?.data.length > 0 ? (
							<SmallText style={{ color: theme.colors.turquoise }}>
								차밥 줄 차량을 선택해주세요!
							</SmallText>
						) : (
							<SmallText style={{ color: theme.colors.turquoise }}>등록된 차량이 없습니다.</SmallText>
						)}
					</Header>

					{userEvListData?.data.length > 0 ? (
						<ScrollView>
							{userEvListData.data.map((userEv) => (
								<Contents
									key={userEv.userEvId}
									style={styles.shadow}
									onPress={() =>
										navigate(SEARCH_TAB_FLOW, {
											screen: CHARGING_STATION_SEARCH_SCREEN,
											params: userEv,
										})
									}
								>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										{/* label */}
										<View
											style={
												userEv.userTypeCd === 'PERSON' ? styles.personLabel : styles.corpLabel
											}
										>
											<SmallText>{userEv.userType}</SmallText>
										</View>
										{/* bar */}
										<View style={{ flex: 0.05 }} />
										<View style={styles.verticalBar} />
										{/* text */}
										<View style={{ flex: 1 }}>
											<SmallText>{userEv.nickname}</SmallText>
											<SmallText>{userEv.model}</SmallText>
										</View>
									</View>
								</Contents>
							))}
						</ScrollView>
					) : (
						<EmptyView>
							<View style={{ flex: 0.8, justifyContent: 'center' }}>
								<SmallText>차밥을 주기 위해서 내 차량을 등록해주세요.</SmallText>
							</View>
							<View style={{ flex: 0.2, justifyContent: 'flex-end' }}>
								<Button>
									<SmallText style={{ fontWeight: 'bold', color: 'white' }}>차량 등록하기</SmallText>
								</Button>
							</View>
						</EmptyView>
					)}
				</Wrap>
			</Container>
		</>
	)
}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: verticalScale(5),
		},
		shadowOpacity: 0.29,
		shadowRadius: moderateScale(4.65),
		elevation: 5,
	},
	personLabel: {
		flex: 0.25,
		alignItems: 'center',
		backgroundColor: theme.colors.white,
		borderWidth: verticalScale(2),
		borderRadius: moderateScale(22),
		borderColor: theme.colors.turquoise,
	},
	corpLabel: {
		flex: 0.25,
		alignItems: 'center',
		backgroundColor: theme.colors.white,
		borderWidth: verticalScale(2),
		borderRadius: moderateScale(22),
		borderColor: theme.colors.orange,
	},
	verticalBar: {
		flex: 0.05,
		height: '100%',
		borderLeftWidth: verticalScale(1.5),
		borderColor: theme.colors.disabled,
	},
})
