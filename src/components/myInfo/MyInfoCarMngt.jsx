import userConst from '@/constants/userConst'
import { DELETE_USER_EV, GET_USER_MY_EV_LIST } from '@/core/store/api/create/userEvCreate'
import { useUserEvContext } from '@/core/store/api/providers/UserEvApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import { useError } from '@/core/store/common/providers/ErrorProvider'
import { useUser } from '@/core/store/common/providers/UserProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { CorpSvg, DefaultSvg, PersonalSvg, PlusCircleSvg, ThreeDotsSvg } from '@util/svgUtil'
import moment from 'moment'
import React, { useCallback, useState } from 'react'
import { FlatList, Platform, StyleSheet, View } from 'react-native'
import styled from 'styled-components'
import Loading from '../ui/Loading'
import PopupMenu from '../ui/popupMenu/PopupMenu'
import SmallText from '../ui/text/SmallText'

const Container = styled.View`
	flex: 1;
	/* padding: ${moderateScale(15)}px; */
	background-color: ${theme.colors.background};
	padding: ${moderateScale(24)}px;
`

const Contents = styled.View`
	width: 100%;
	align-items: center;
`
const SignInBtnView = styled.View`
	justify-content: flex-end;
	align-items: center;
`

const ItemContents = styled.View`
	border-radius: ${moderateScale(5)}px;
	border-width: ${moderateScale(1)}px;
	border-color: ${theme.colors.white};
	padding: ${moderateScale(8)}px;
	margin-bottom: ${verticalScale(36)}px;
	flex-direction: row;
	background-color: ${theme.colors.white};
`

const UserView = styled.View`
	margin-top: ${verticalScale(2)}px;
	margin-bottom: ${verticalScale(2)}px;
	padding-horizontal: ${horizontalScale(14)}px;
	border-right-color: ${theme.colors.line};
	border-right-width: ${moderateScale(1)}px;
	align-items: center;
	justify-content: center;
`

const ItemView = styled.View`
	margin-left: ${horizontalScale(14)}px;
	flex: 1;
`

const ConfirmButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 90%;
	height: ${verticalScale(50)}px;
	background-color: ${theme.colors.turquoise};
	border-color: ${theme.colors.white};
	border-width: ${moderateScale(1)}px;
	border-radius: ${moderateScale(8)}px;
	flex-direction: row;
	bottom: ${verticalScale(40)}px;
`
const ModifyIcon = styled.Image`
	width: ${moderateScale(48)}px;
	height: ${moderateScale(48)}px;
	margin-right: ${horizontalScale(4)}px;
`
const {
	MY_CHABAP_TAB_FLOW,
	PERSON_SIGN_IN_CAR_INPUT_SCREEN,
	CORP_SIGN_IN_CAR_INPUT_SCREEN,
	MY_INFO_CHANGE_CAR_INFO_SCREEN,
} = constants
const { USER_CORPORATION_EV, USER_PERSONAL_EV } = userConst
export default function MyInfoCarMngt() {
	const { state, dispatch } = useUserEvContext()
	const { $confirm } = useConfirm()
	const { dispatch: deleteEvDispatch } = useUserEvContext()
	const [searchType] = useState('my')
	const { data: userEvListData, loading: userEvLoading } = state.userMyEvList
	const evList = userEvListData?.data || []
	const {
		userState: { id, userTypeCd },
	} = useUser()

	const { navigate } = useNavigation()

	const { $alert } = useAlert()
	const { $error } = useError()

	useFocusEffect(
		useCallback(() => {
			getUserEvList()
		}, []),
	)

	const [menuOptions] = useState([
		{
			index: 0,
			icon: () => (
				<ModifyIcon source={require('@assets/icons/modify_btn.png')} />
				// <SettingSvg
				// 	style={{
				// 		...theme.shadow(),
				// 		...styles.iconPopMenu,
				// 		marginLeft: Platform.OS === 'ios' ? horizontalScale(-12) : horizontalScale(-16),
				// 		marginRight: Platform.OS === 'ios' ? horizontalScale(8) : horizontalScale(8),
				// 	}}
				// 	width={moderateScale(48)}
				// 	height={moderateScale(48)}
				// />
			),

			text: '수정',
			callback: (userEvId) => handleUpdateEv(userEvId),
		},
		{
			index: 1,
			icon: () => (
				<ModifyIcon source={require('@assets/icons/delete_btn.png')} />
				// <TrashSvg
				// 	style={{
				// 		...theme.shadow(),
				// 		...styles.iconPopMenu,
				// 		marginLeft: Platform.OS === 'ios' ? horizontalScale(-12) : horizontalScale(-16),
				// 		marginRight: Platform.OS === 'ios' ? horizontalScale(8) : horizontalScale(8),
				// 	}}
				// 	width={moderateScale(48)}
				// 	height={moderateScale(48)}
				// />
			),

			text: '삭제',
			callback: (userEvId) => handleConfirmDeleteBookMark(userEvId),
		},
	])

	function handleUpdateEv(userEvId) {
		navigate(MY_INFO_CHANGE_CAR_INFO_SCREEN, { userEvId: userEvId })
	}

	function handleConfirmDeleteBookMark(userEvId) {
		$confirm({
			msg: '차량을 삭제 하시겠습니까?',
			cancelButtonName: '아니오',
			confirmButtonName: '예',
			onPress: (result) => {
				if (result) {
					handleDeleteEv(userEvId)
				}
			},
		})
	}

	async function handleDeleteEv(userEvId) {
		try {
			const response = await DELETE_USER_EV(deleteEvDispatch, { id: userEvId })
			const resData = response.data

			if (resData?.data) {
				getUserEvList()
			} else {
				$alert('삭제 실패 관리자에게 문의해주세요')
			}
			if (resData?.code !== 'SUCCESS') {
				$alert(resData?.msg)
			}
		} catch (e) {
			console.log(e)
			const errData = e?.data
			if (errData?.code) {
				const { code, msg } = errData
				setTimeout(() => {
					$error({
						code,
						msg,
						onPress: (result) => {
							if (result) {
								handleDeleteEv()
							}
						},
					})
				}, 1000)
			}
		}
	}
	function handelConfirmCarSignAdd() {
		userTypeCd + '_EV' === USER_PERSONAL_EV
			? navigate(MY_CHABAP_TAB_FLOW, {
					screen: PERSON_SIGN_IN_CAR_INPUT_SCREEN,
					params: { userId: id, userType: userTypeCd },
			  })
			: userTypeCd + '_EV' === USER_CORPORATION_EV
			? navigate(MY_CHABAP_TAB_FLOW, {
					screen: CORP_SIGN_IN_CAR_INPUT_SCREEN,
					params: { userId: id, userType: userTypeCd },
			  })
			: new Error('User type error')
	}
	// 보유 차량 목록
	async function getUserEvList() {
		try {
			const response = await GET_USER_MY_EV_LIST(dispatch, { searchType })

			const resData = response.data
			if (resData?.code !== 'SUCCESS') {
				$alert(resData?.msg)
			}
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<>
			{userEvLoading && <Loading />}
			<Container>
				{evList.length > 0 ? (
					<FlatList
						data={evList}
						keyExtractor={(item) => item.userEvId}
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
						renderItem={({ item, index }) => (
							<ItemContents key={item.userEvId} style={{ ...styles.contents, ...theme.shadow() }}>
								{/* label */}
								<UserView>
									{item.userTypeCd === 'PERSON' ? (
										<PersonalSvg
											style={{ ...theme.shadow(), ...styles.icon }}
											width={moderateScale(26)}
											height={moderateScale(26)}
										/>
									) : (
										<CorpSvg
											style={{ ...theme.shadow(), ...styles.icon }}
											width={moderateScale(26)}
											height={moderateScale(26)}
										/>
									)}
									<SmallText style={styles.textLabel}>{item.userType}</SmallText>
								</UserView>

								<ItemView>
									<SmallText style={styles.nickName}>{item.nickname}</SmallText>
									<SmallText style={styles.model}>{item.model}</SmallText>
									<SmallText style={styles.date}>
										등록일시: {moment(item.regDate).format('YY.MM.DD')}
									</SmallText>
								</ItemView>

								<View style={{ flexDirection: 'row' }}>
									{item.defaultFlag === 'Y' ? (
										<DefaultSvg
											style={{ marginTop: verticalScale(10), marginRight: horizontalScale(16) }}
											width={moderateScale(20)}
											height={moderateScale(20)}
										/>
									) : null}
									<PopupMenu
										icon={
											<ThreeDotsSvg
												style={{
													marginTop: verticalScale(10),
												}}
												width={moderateScale(20)}
												height={moderateScale(15)}
											/>
										}
										menuOptions={menuOptions}
										defaultResult={evList[index].defaultFlag}
										item={evList[index].userEvId}
									/>
								</View>
							</ItemContents>
						)}
					/>
				) : (
					<Contents>
						<SmallText style={styles.header}>차량 정보가 없습니다.</SmallText>
						<SmallText style={styles.subText}>차량을 추가해 주세요.</SmallText>
					</Contents>
				)}
			</Container>
			<SignInBtnView>
				<ConfirmButton onPress={() => handelConfirmCarSignAdd()}>
					<PlusCircleSvg width={moderateScale(16)} height={moderateScale(16)} />
					<SmallText style={styles.buttonText}>차량 추가</SmallText>
				</ConfirmButton>
			</SignInBtnView>
		</>
	)
}

const styles = StyleSheet.create({
	registerBtn: {
		alignSelf: 'center',
		backgroundColor: theme.colors.turquoise,
	},
	itemStyle: {
		marginRight: moderateScale(70),
	},
	contentStyle: { width: horizontalScale(312) },
	textLabel: {
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		alignSelf: 'center',
	},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
		marginLeft: horizontalScale(8),
	},

	verticalBar: {
		// flex: 0.05,
		// height: '100%',
		borderLeftWidth: verticalScale(1.5),
		borderColor: theme.colors.disabled,
	},
	contents: {
		elevation: 1,
		borderColor: theme.colors.white,
	},
	inputContent: {
		flex: 1,
	},
	icon: {
		...Platform.select({
			android: {
				borderRadius: moderateScale(16),
			},
		}),
		alignSelf: 'center',
		marginBottom: verticalScale(4),
	},

	iconPopMenu: {
		...Platform.select({
			android: {
				borderRadius: moderateScale(16),
			},
		}),
		alignSelf: 'center',
		marginBottom: verticalScale(4),
	},
	popupIcon: {
		...Platform.select({
			android: {
				borderRadius: moderateScale(24),
			},
		}),
	},
	nickName: {
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		paddingTop: verticalScale(8),
		marginBottom: verticalScale(10),
	},
	model: {
		fontSize: moderateScale(14),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		marginBottom: verticalScale(10),
	},
	date: {
		fontSize: moderateScale(12),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		paddingBottom: verticalScale(8),
	},
})
