import Loading from '@/components/ui/Loading'
import Paragraph from '@/components/ui/text/Paragraph'
import SmallText from '@/components/ui/text/SmallText'
import userConst from '@/constants/userConst'
import { GET_NEW_USER_EV_LIST } from '@/core/store/api/create/userEvCreate'
import { useUserEvContext } from '@/core/store/api/providers/UserEvApiProvider'
import { useAlert } from '@/core/store/common/providers/AlertProvider'
import { useConfirm } from '@/core/store/common/providers/ConfirmProvider'
import { useError } from '@/core/store/common/providers/ErrorProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { CarPlusSvg, CorpSvg, DefaultSvg, PersonalSvg } from '@util/svgUtil'
import React, { useCallback } from 'react'
import { FlatList, Platform, StyleSheet, View } from 'react-native'
import styled from 'styled-components'

//자동자 정보 입력 api맵핑해서

const Container = styled.View`
	height: 100%;
	background-color: ${theme.colors.background};
`
const Wrap = styled.View`
	padding: ${moderateScale(24)}px;
	flex: 1;
`

const SignInBtnView = styled.View`
	align-items: center;
	justify-content: flex-end;
`
const ItemContents = styled.View`
	background-color: ${theme.colors.white};
	border-radius: ${moderateScale(4)}px;
	margin-top: ${verticalScale(16)}px;
	padding-top: ${verticalScale(16)}px;
	padding-left: ${verticalScale(24)}px;
	height: ${verticalScale(76)}px;
	flex-direction: row;
`
const PlusBtnView = styled.View`
	flex: 10;
`

const ConfirmButton = styled.TouchableOpacity`
	align-items: center;
	width: 100%;
	height: ${moderateScale(55)}px;
	border-radius: ${moderateScale(8)}px;
	border-width: ${moderateScale(1)}px;
	border-color: #dbdbdb;
	background-color: ${theme.colors.background};
	padding-left: ${horizontalScale(25)}px;
	border-style: dashed;
	flex-direction: row;
`
const ConfirmCardButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 90%;
	height: ${verticalScale(55)}px;
	background-color: ${theme.colors.turquoise};
	flex-direction: row;
	border-radius: ${moderateScale(8)}px;
	border-width: ${moderateScale(1)}px;
	border-color: ${theme.colors.background};
`

const ConfirmView = styled.View`
	/* padding-top: ${verticalScale(20)}px; */
	justify-content: center;
	align-items: center;
`

const ConfirmTitleView = styled.View`
	/* padding-bottom: ${verticalScale(10)}px; */
	margin-bottom: ${verticalScale(16)}px;
`

const ConfirmFooterView = styled.View`
	margin-top: ${verticalScale(16)}px;
`

const {
	// PERSON_SIGN_UP_CARD_INPUT_SCREEN,
	// CORP_SIGN_UP_CARD_INPUT_SCREEN,
	PERSON_SIGN_UP_CAR_INPUT_SCREEN,
	CORP_SIGN_UP_CAR_INPUT_SCREEN,
	MAIN_TAB_FLOW,
	MY_CHABAP_TAB_FLOW,
	MY_INFO_CHANGE_CARD_INFO_SCREEN,
} = constants
const { USER_CORPORATION, USER_PERSONAL } = userConst
export default function CommonSignUpCarAddInput({ userType }) {
	const { state, dispatch } = useUserEvContext()
	const { data: newUserEvList, loading: newUserEvLoading } = state.newUserEvList
	const newEvList = newUserEvList?.data || []
	const { navigate, reset, replace } = useNavigation()
	const { $alert } = useAlert()
	const { $confirm, closeConfirm } = useConfirm()
	const { $error } = useError()

	useFocusEffect(
		useCallback(() => {
			getNewUserEvList()
		}, []),
	)

	function handelConfirmCarSignUp() {
		$confirm({
			msg: (
				<ConfirmView>
					<ConfirmTitleView>
						<Paragraph>차량등록이 완료되었습니다.</Paragraph>
					</ConfirmTitleView>
					<SmallText style={{ color: theme.colors.darkGray }}>*차량추가 등록은</SmallText>
					<SmallText style={{ color: theme.colors.turquoise }}>
						마이차밥{'>'}차량정보 관리에서
						<SmallText style={{ color: theme.colors.darkGray }}> 가능합니다.</SmallText>
					</SmallText>
					<ConfirmFooterView>
						<Paragraph>카드등록을 하시겠습니까?</Paragraph>
					</ConfirmFooterView>
				</ConfirmView>
			),
			cancelButtonName: '나중에',
			confirmButtonName: '등록',
			onPress: (result) => {
				//PERSON_SIGN_UP_CAR_INPUT_SCREEN userEmail: personalReqData.email
				if (result === true) {
					closeConfirm()
					setTimeout(() => {
						replace(MY_CHABAP_TAB_FLOW, {
							screen: MY_INFO_CHANGE_CARD_INFO_SCREEN,
							params: { isNewMember: true },
						})
					}, 1000)
				} else {
					closeConfirm()
					setTimeout(() => {
						reset({ routes: [{ name: MAIN_TAB_FLOW }] })
					}, 1000)
				}
			},
		})
	}

	function handelConfirmCarSignAdd() {
		userType === USER_PERSONAL
			? navigate(PERSON_SIGN_UP_CAR_INPUT_SCREEN)
			: userType === USER_CORPORATION
			? navigate(CORP_SIGN_UP_CAR_INPUT_SCREEN)
			: new Error('User type error')
	}
	//등록 차량 목록
	async function getNewUserEvList() {
		try {
			const response = await GET_NEW_USER_EV_LIST(dispatch)

			const resData = response.data

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
								getNewUserEvList()
							}
						},
					})
				}, 1000)
			}
		}
	}

	return (
		<>
			{newUserEvLoading && <Loading />}
			<Container>
				<Wrap>
					<FlatList
						data={newEvList}
						keyExtractor={(item) => item.userEvId}
						renderItem={({ item }) => (
							<ItemContents key={item.userEvId} style={{ ...styles.contents, ...theme.shadow() }}>
								{/* label */}
								<View style={{ flex: 1 }}>
									{item.userTypeCd === 'PERSON' ? (
										<PersonalSvg
											style={{ ...theme.shadow(), ...styles.icon }}
											width={moderateScale(30)}
											height={moderateScale(30)}
										/>
									) : (
										<CorpSvg
											style={{ ...theme.shadow(), ...styles.icon }}
											width={moderateScale(30)}
											height={moderateScale(30)}
										/>
									)}

									<SmallText style={styles.textLabel}>{item.userType}</SmallText>
								</View>

								{/* text */}
								<View style={{ flex: 4 }}>
									<SmallText style={styles.headText}>{item.nickname}</SmallText>
									<SmallText style={styles.subText}>{item.model}</SmallText>
								</View>
								<View style={{ flex: 1 }}></View>
								{item.defaultFlag === 'Y' ? (
									<DefaultSvg width={moderateScale(15)} height={moderateScale(15)} />
								) : null}
							</ItemContents>
						)}
					/>
					<PlusBtnView>
						<ConfirmButton onPress={handelConfirmCarSignAdd}>
							<CarPlusSvg
								style={{ ...theme.shadow(), ...styles.icon }}
								width={moderateScale(28)}
								height={moderateScale(28)}
							/>

							<SmallText style={styles.carAddbtn}>차량 추가 등록</SmallText>
						</ConfirmButton>
					</PlusBtnView>
				</Wrap>

				<SignInBtnView>
					<ConfirmCardButton style={{ marginBottom: verticalScale(40) }} onPress={handelConfirmCarSignUp}>
						<SmallText style={styles.buttonText}>카드 등록</SmallText>
					</ConfirmCardButton>
				</SignInBtnView>
			</Container>
		</>
	)
}

const styles = StyleSheet.create({
	itemStyle: {
		marginRight: 70,
	},

	contents: {},
	buttonText: {
		fontWeight: 'bold',
		fontSize: moderateScale(16),
		color: theme.colors.white,
	},
	textLabel: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		fontSize: moderateScale(12),
		marginTop: verticalScale(4),

		marginLeft: verticalScale(3),
	},
	headText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		fontSize: moderateScale(14),
		marginBottom: horizontalScale(8),
		marginTop: verticalScale(2),
	},
	subText: {
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		fontSize: moderateScale(12),
		color: '#494949',
	},
	carAddbtn: {
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		fontSize: moderateScale(16),
		marginLeft: horizontalScale(41),
		color: theme.colors.text,
	},
	icon: {
		//marginTop: moderateScale(Platform.OS === 'ios' ? 2 : 0),
		...Platform.select({
			android: {
				borderRadius: moderateScale(16),
			},
		}),
		justifyContent: 'center',
	},
})
