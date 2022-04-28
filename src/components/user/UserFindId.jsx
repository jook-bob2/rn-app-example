import SmallText from '@/components/ui/text/SmallText'
import { GET_FIND_EMAIL } from '@/core/store/api/create/userCreate'
import { useUserContext } from '@/core/store/api/providers/UserApiProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/core'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import { CheckmarkCircle, CircleWhite, CorporationDisableSvg, PersonalDisableSvg } from '@util/svgUtil'
import React, { useCallback, useState } from 'react'
import { FlatList, Platform, Pressable, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import Checkbox from '../ui/checkbox/Checkbox'
import Loading from '../ui/Loading'
import Modal from '../ui/modal/Modal'
import Left from '../ui/view/Left'
import Right from '../ui/view/Right'

const { FIND_PASSWORD_SCREEN, SIGN_IN_SCREEN, SIGN_UP_SELECTION_SCREEN } = constants

const Container = styled.View`
	padding: ${verticalScale(32)}px;
	height: 93%;
`

const EmptyContainer = styled.View`
	padding: ${verticalScale(32)}px;
	background-color: ${theme.colors.white};
`
const Feedback = styled.View`
	height: 20%;
`

const ConfirmButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 100%;
	height: ${Platform.OS === 'ios' ? verticalScale(90) : verticalScale(50)}px;
	background-color: ${theme.colors.turquoise};
	border-color: ${theme.colors.white};
	flex-direction: row;
`
const ConfirmLoginButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 100%;
	height: ${Platform.OS === 'ios' ? verticalScale(90) : verticalScale(50)}px;
	background-color: ${theme.colors.darkGray};
	border-color: ${theme.colors.white};
	flex-direction: row;
`

const SelectedListView = styled.View`
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(22)}px;
	padding: ${moderateScale(10)}px;
	margin: ${moderateScale(3)}px;
	flex-direction: row;
	justify-content: space-between;
	border-color: ${theme.colors.disabled};
`

const EmptyView = styled.View`
	border-width: ${horizontalScale(1)}px;
	border-radius: ${moderateScale(22)}px;
	padding: ${moderateScale(10)}px;
	margin: ${moderateScale(3)}px;
	flex-direction: row;
	justify-content: center;
	border-color: ${theme.colors.disabled};
`

// const CorporationView = styled.View`
// 	width: ${horizontalScale(52)}px;
// 	border-width: ${horizontalScale(2)}px;
// 	border-color: ${theme.colors.orange};
// 	border-radius: ${horizontalScale(40)}px;
// 	align-items: center;
// 	// justify-content: center;
// 	margin: 0px ${horizontalScale(10)}px;
// `
const Footer = styled.View`
	flex: 1;
	justify-content: flex-end;
	align-items: center;
	background-color: ${theme.colors.white};
`

// const TrueImg = styled.Image`
// 	width: ${horizontalScale(11)}px;
// 	height: ${verticalScale(11)}px;
// `
const ButtonContainer = styled.View`
	flex-direction: row;
`
// const FalseImg = styled.Image``

const ModalContentView = styled.View`
	border-radius: ${moderateScale(5)}px;
	background-color: ${theme.colors.white};
	height: ${verticalScale(80)}px;
	align-items: center;
	padding: ${moderateScale(30)}px;
`

const ModalContainer = styled.View`
	flex: 1;
	z-index: 1;
	margin: ${moderateScale(25)}px;
`

export default function UserFindId() {
	const { navigate, replace } = useNavigation()
	const [emailList, setEmailList] = useState([])
	const { state, dispatch: userDispatch } = useUserContext()
	const [email, setEmail] = useState()
	const { loading } = state.userFindEmail
	const [toggle, onToggle] = useState('')
	const { params } = useRoute()
	const [openModal, setOpenModal] = useState(false)
	//const { $alert } = useAlert()
	useFocusEffect(
		useCallback(() => {
			handleUserEmailList()
		}, [params.reponseData]),
	)

	async function handleUserEmailList() {
		try {
			const birth = params.reponseData.birthdate
			const year = birth.substr(0, 4)
			const month = birth.substr(4, 2)
			const date = birth.substr(6, 2)
			const birthDate = year + '-' + month + '-' + date
			const response = await GET_FIND_EMAIL(userDispatch, {
				hp: params.reponseData.mobileno,
				name: params.reponseData.name,
				birthdateStr: birthDate,
			})
			const resData = response.data

			if (resData?.code === 'SUCCESS') {
				const emails = resData.data
				const emailinfo = emails.map((item) => {
					return {
						email: item.email,
						userTypeCd: item.userTypeCd,
					}
				})
				setEmailList(emailinfo)
			}
		} catch (error) {
			console.log('error ==> ', error)
		}
	}

	function handleSelectEmail(item) {
		setEmail(item.email)
		onToggle(item.email)
	}
	function handleFindPasswordVerify() {
		const birth = params.reponseData.birthdate
		const year = birth.substr(0, 4)
		const month = birth.substr(4, 2)
		const date = birth.substr(6, 2)

		const findReqInfo = {
			email: email,
			hp: params.reponseData.mobileno,
			birthdate: year + '-' + month + '-' + date,
			name: params.reponseData.name,
		}
		if (email) {
			navigate(FIND_PASSWORD_SCREEN, { findPasswd: findReqInfo })
		} else {
			setOpenModal(true)
		}
	}
	return (
		<>
			{loading && <Loading />}

			{emailList.length > 0 ? (
				<>
					<Container>
						<SmallText style={styles.header}>회원님, 반갑습니다.</SmallText>
						<SmallText style={styles.subText}>고객님께서 가입하신 이메일입니다.</SmallText>
						<FlatList
							data={emailList}
							keyExtractor={(item) => item.email}
							renderItem={({ item }) => (
								<Pressable onPress={() => handleSelectEmail(item)}>
									<SelectedListView
									//style={item.email === toggle ? styles.selectBorder : styles.untSelectBorder}
									>
										<Left style={{ alignSelf: 'center' }}>
											{item.userTypeCd === 'PERSON' ? (
												<PersonalDisableSvg
													width={moderateScale(24)}
													height={moderateScale(24)}
												/>
											) : item.userTypeCd === 'CORP' ? (
												<CorporationDisableSvg
													width={moderateScale(24)}
													height={moderateScale(24)}
												/>
											) : null}
											<SmallText style={{ alignSelf: 'center', marginLeft: horizontalScale(8) }}>
												{item.email}
											</SmallText>
										</Left>
										{item.email === toggle ? (
											<Right style={styles.right}>
												<Checkbox
													onPress={() => handleSelectEmail(item)}
													checked={toggle}
													customTrueImage={
														<CheckmarkCircle
															width={moderateScale(24)}
															height={moderateScale(24)}
														/>
													}
												/>
											</Right>
										) : (
											<Right style={styles.right}>
												<Checkbox
													onPress={() => handleSelectEmail(item)}
													customFalseImage={
														<CircleWhite
															width={moderateScale(24)}
															height={moderateScale(24)}
														/>
													}
												/>
											</Right>
										)}
									</SelectedListView>
								</Pressable>
							)}
						/>
					</Container>
					<ButtonContainer>
						<Footer>
							<ConfirmLoginButton onPress={() => navigate(SIGN_IN_SCREEN)}>
								<SmallText style={styles.joinText}>로그인</SmallText>
							</ConfirmLoginButton>
						</Footer>
						<Footer>
							<ConfirmButton onPress={() => handleFindPasswordVerify()}>
								<SmallText style={styles.findText}>비밀번호 찾기</SmallText>
							</ConfirmButton>
						</Footer>
					</ButtonContainer>
					{openModal ? (
						<Modal.Common
							transparent={true}
							visible={openModal}
							animationType="fade"
							setClose={() => setOpenModal(false)}
						>
							<Feedback />
							<ModalContainer>
								<ModalContentView>
									<SmallText style={styles.warnStlye}>
										비밀번호를 변경하실 계정을 선택해주세요.
									</SmallText>
								</ModalContentView>
							</ModalContainer>
						</Modal.Common>
					) : null}
				</>
			) : (
				<>
					<EmptyContainer>
						<SmallText style={styles.header}>가입 정보가 없습니다.</SmallText>
						<SmallText style={styles.subText}>새로가입하시겠습니까?</SmallText>

						<EmptyView>
							<PersonalDisableSvg width={moderateScale(24)} height={moderateScale(24)} />

							<SmallText style={styles.emptyText}>존재하지 않는 ID 입니다.</SmallText>
						</EmptyView>
					</EmptyContainer>

					<Footer>
						<ConfirmButton onPress={() => replace(SIGN_UP_SELECTION_SCREEN)}>
							<SmallText style={styles.joinText}>{' 회원가입 신청'}</SmallText>
						</ConfirmButton>
					</Footer>
				</>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	subtitle: {
		color: theme.colors.turquoise,
	},
	row: {
		alignSelf: 'center',
		paddingBottom: verticalScale(10),
	},
	textInput: {
		maxWidth: moderateScale(336),
	},
	joinText: {
		color: theme.colors.white,
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		fontSize: moderateScale(14),
	},
	findText: {
		color: theme.colors.white,
	},
	whiteText: {
		color: theme.colors.white,
	},
	standardText: {
		fontWeight: 'bold',

		alignSelf: 'center',
	},
	footerText: {
		alignSelf: 'center',
		fontWeight: 'bold',
		fontSize: 14,
	},
	subText: {
		alignSelf: 'center',
		paddingBottom: verticalScale(40),
	},

	header: {
		fontSize: 18,
		alignSelf: 'center',
		padding: moderateScale(5),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	selectBorder: {
		borderColor: theme.colors.turquoise,
	},
	untSelectBorder: {
		borderColor: theme.colors.disabled,
	},
	trueStyle: {
		tintColor: theme.colors.white,
	},
	warnStlye: { fontSize: moderateScale(14), fontFamily: theme.fonts.spoqaHanSansNeo.bold },
	emptyText: {
		fontSize: moderateScale(12),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
		alignSelf: 'center',
		marginLeft: horizontalScale(5),
	},
})
