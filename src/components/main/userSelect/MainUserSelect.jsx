import React, { useEffect, useState, useMemo } from 'react'
import Modal from '@/components/ui/modal/Modal'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import userConst from '@/constants/userConst'
import { useUserSelect } from '@/core/store/common/providers/UserSelectProvider'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { useNavigation } from '@react-navigation/core'
import { Dimensions, FlatList, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'
import constants from '@/navigations/constants'
import { storageUtil } from '@util/storageUtil'
import storageConst from '@/constants/storageConst'
import { useUser } from '@/core/store/common/providers/UserProvider'
import { POST_USER_SIGN_SELECT } from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { CheckSvg, CorpSvg, PersonalSvg, UserAddSvg } from '@util/svgUtil'
import Loading from '@/components/ui/Loading'
import SmallText from '@/components/ui/text/SmallText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const UserListView = styled.View`
	margin: 0px ${horizontalScale(20)}px;
	padding: ${verticalScale(20)}px 0px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`

const UserItemView = styled.View`
	border-color: ${theme.colors.white};
	border-radius: ${moderateScale(18)}px;
	align-items: center;
	justify-content: center;
	/* margin: 0px ${horizontalScale(18)}px; */
`

const UserAddView = styled.View`
	padding: ${verticalScale(20)}px ${horizontalScale(20)}px 0px ${horizontalScale(20)}px;
	padding-bottom: ${Platform.OS === 'ios' ? verticalScale(40) : verticalScale(20)}px;
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
`

const SelectedView = styled.View`
	/* width: ${horizontalScale(35)}px;
	height: ${verticalScale(35)}px; */
	align-items: center;
	justify-content: center;
`

const NameView = styled.View`
	padding-left: ${moderateScale(10)}px;
	padding-right: ${moderateScale(10)}px;
	align-self: center;
`

const { USER_PERSONAL, USER_CORPORATION } = userConst
const { AUTH_STACK_FLOW, SIGN_IN_SCREEN } = constants
const { USING_USER_LIST, AUTO_SIGN } = storageConst

const ITEM_MAX_COUNT = 2
const ITEM_HEIGHT = verticalScale(68)
const ADD_HEIGHT = verticalScale(68)

const win = Dimensions.get('window')
const winHeight = win.height

export default function MainUserSelect({ getUserEvList }) {
	const { navigate } = useNavigation()
	const {
		userSelectState: { isOpen },
		closeUserSelect,
	} = useUserSelect()
	const [loading, setLoading] = useState(false)
	const { userState, userListLoading, removeRefresh, onLoginSuccess, saveSignInHistory } = useUser()
	const { dispatch: userDispatch } = useUserContext()
	const { $alert } = useAlert()

	const [isRefreshing] = useState(true)
	const [userList, setUserList] = useState([])
	const insets = useSafeAreaInsets()

	/*
	 * 유저 리스트 소환
	 */
	useEffect(() => {
		if (!userListLoading) {
			storageUtil.getItem({ key: USING_USER_LIST }).then((response) => {
				const users = response?.data || []
				if (users?.length > 0) {
					setUserList(
						users.sort((a, b) => {
							if (a.selected) return -1
							if (b.selected) return -1
							return 0
						}),
					)
				}
			})
		}
	}, [userListLoading])

	/*
	 * 아이템 개수
	 */
	const itemCount = useMemo(() => (userList.length > ITEM_MAX_COUNT ? ITEM_MAX_COUNT : userList.length), [userList])
	const iosHeight = useMemo(
		() => winHeight - ITEM_HEIGHT * itemCount - ADD_HEIGHT - insets.bottom,
		[itemCount, insets],
	)
	const aosHeight = useMemo(
		() => winHeight - ITEM_HEIGHT * itemCount - ADD_HEIGHT - insets.bottom,
		[itemCount, insets],
	)

	// const moveToastToggle = animated.interpolate({
	// 	inputRange: [-100, 100],
	// 	outputRange: [600, 0],
	// 	extrapolate: 'clamp',
	// })

	/*
	 * 선택 시 계정 전환
	 */
	async function handlePressSelectUser(id) {
		setLoading(true)
		closeUserSelect()
		if (userState.id !== id) {
			const accessTokenList = []
			const refreshTokenList = []

			for (const u of userList) {
				accessTokenList.push(u.accessToken)
				refreshTokenList.push(u.refreshToken)
			}

			setTimeout(async () => {
				try {
					const response = await POST_USER_SIGN_SELECT(userDispatch, {
						id,
						accessTokenList,
						refreshTokenList,
					})
					const autoSignData = await storageUtil.getItem({ key: AUTO_SIGN })
					const autoSign = autoSignData?.data
					if (response.data) {
						const resData = response.data
						if (resData.success && resData?.data?.accessToken) {
							removeRefresh()
							const isLogin = await onLoginSuccess({
								...resData.data,
								autoSign: autoSign ? autoSign : true,
							})
							if (isLogin === true) {
								getUserEvList()
								setLoading(false)
							}

							// 로그인 후 로그인 히스토리 저장
							const histResult = await saveSignInHistory(resData.data.id)
							const { success, msg } = histResult
							if (!success) {
								setTimeout(() => {
									$alert(msg)
								}, 1000)
							}
						} else if (resData.code) {
							setLoading(false)
							$alert(resData.msg)
						}
					}
				} catch (error) {
					setLoading(false)
					console.log('login error => ', error)
				}
			}, 500)
		} else {
			setLoading(false)
			$alert('이미 선택 되어 있는 계정입니다.')
		}
	}

	return (
		<>
			{loading && <Loading />}
			<Modal.Common transparent={true} visible={isOpen} animationType="fade" setClose={closeUserSelect}>
				<View
					style={{
						flex: 1,
						zIndex: 1,
						marginTop: Platform.OS === 'ios' ? iosHeight : aosHeight,
					}}
				>
					<FlatList
						style={{
							...styles.flatList,
						}}
						data={userList}
						keyExtractor={(item) => item.id}
						renderItem={(render) => (
							<>
								<TouchableOpacity onPress={() => handlePressSelectUser(render.item.id)}>
									<UserListView>
										<Left style={styles.center}>
											{render.item.userTypeCd === USER_PERSONAL ? (
												<UserItemView style={{ ...theme.shadow(), ...styles.icon }}>
													<PersonalSvg width={moderateScale(32)} height={moderateScale(32)} />
												</UserItemView>
											) : render.item.userTypeCd === USER_CORPORATION ? (
												<UserItemView style={{ ...theme.shadow(), ...styles.icon }}>
													<CorpSvg width={moderateScale(32)} height={moderateScale(32)} />
												</UserItemView>
											) : null}
											<NameView>
												<SmallText style={styles.nameText}>{render.item.name}</SmallText>
											</NameView>
										</Left>

										{render.item.selected && (
											<Right style={styles.center}>
												<SelectedView>
													<CheckSvg width={moderateScale(21)} height={moderateScale(15)} />
												</SelectedView>
											</Right>
										)}
									</UserListView>
								</TouchableOpacity>
								{render.index + 1 === itemCount && (
									<Pressable
										style={{
											...styles.center,
											backgroundColor: theme.colors.white,
										}}
										onPress={() => {
											closeUserSelect()
											navigate(AUTH_STACK_FLOW, { screen: SIGN_IN_SCREEN })
										}}
									>
										<UserAddView>
											<Left>
												<UserItemView style={{ ...theme.shadow(), ...styles.icon }}>
													<UserAddSvg width={moderateScale(32)} height={moderateScale(32)} />
												</UserItemView>
												<NameView>
													<SmallText style={styles.addText}>{'계정추가'}</SmallText>
												</NameView>
											</Left>
										</UserAddView>
									</Pressable>
								)}
							</>
						)}
						refreshing={isRefreshing}
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
					/>
				</View>
			</Modal.Common>
		</>
	)
}

const styles = StyleSheet.create({
	flatList: {
		backgroundColor: theme.colors.white,
		borderTopRightRadius: moderateScale(15),
		borderTopLeftRadius: moderateScale(15),
	},
	shadow: {
		shadowColor: '#000',
		backgroundColor: theme.colors.white,
		shadowOffset: {
			width: 0,
			height: verticalScale(1),
		},
		shadowOpacity: moderateScale(0.15),
		shadowRadius: moderateScale(1),
		elevation: 1,
	},
	icon: {
		...Platform.select({
			android: {
				borderRadius: moderateScale(16),
			},
		}),
	},
	center: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	nameText: {
		fontSize: moderateScale(16),
	},
	addText: {
		fontSize: moderateScale(16),
		color: theme.colors.darkGray,
	},
})
