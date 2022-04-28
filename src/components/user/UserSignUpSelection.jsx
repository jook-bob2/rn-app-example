import Logo from '@/components/ui/Logo'
import { GroupCd } from '@/constants/termsConst'
import { GET_CORP_TERMS_LIST, GET_PERSONAL_TERMS_LIST } from '@/core/store/api/create/termsCreate'
import { useTermsContext } from '@/core/store/api/providers/TermsApiProvider'
import constants from '@/navigations/constants'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import React, { useCallback } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'
import SmallText from '../ui/text/SmallText'
import Title from '../ui/text/Title'

const { PERSON_SIGN_UP_TERMS_SCREEN, CORP_SIGN_UP_TERMS_SCREEN, SIGN_IN_SCREEN, MAIN_TAB_FLOW, MAIN_SCREEN } = constants

const Container = styled.View`
	align-items: center;
	margin-top: ${verticalScale(120)}px;
	padding: ${moderateScale(24)}px;
`
const PersonalButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 100%;
	height: ${verticalScale(54)}px;
	background-color: ${theme.colors.turquoise};
	border-color: ${theme.colors.white};
	flex-direction: row;
	margin-top: ${verticalScale(60)}px;
	margin-bottom: ${verticalScale(16)}px;
	border-radius: ${moderateScale(5)}px;
`

const CorpButton = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	width: 100%;
	height: ${verticalScale(54)}px;
	background-color: ${theme.colors.background};
	border-color: ${theme.colors.turquoise};
	border-width: ${moderateScale(1)}px;
	border-radius: ${moderateScale(5)}px;
	flex-direction: row;
`
const LoginBtn = styled.TouchableOpacity`
	border-bottom-width: ${horizontalScale(1)}px;
	border-bottom-color: ${theme.colors.text2};
	margin-top: ${verticalScale(185)}px;
`
const MainBtn = styled.TouchableOpacity`
	border-bottom-width: ${horizontalScale(1)}px;
	border-bottom-color: ${theme.colors.text2};
	align-self: flex-end;
	margin-right: ${verticalScale(24)}px;
	margin-top: ${verticalScale(24)}px;
`

export default function UserSignUpSelection() {
	const { navigate, replace } = useNavigation()
	const { state: termsState, dispatch: termsDispatch } = useTermsContext()
	const personalTermsList = termsState.personTermsList.data?.data || [] // 이용정보 리스트
	const corpTermsList = termsState.corpTermsList.data?.data || [] // 이용정보 리스트

	/*
	 * 이용정보 리스트 함수 Call
	 */
	useFocusEffect(
		useCallback(() => {
			if (personalTermsList.length < 1) {
				getPersonTermsList()
			} else if (personalTermsList.length > 0 && personalTermsList[0].grpCode !== GroupCd.PERSON_USAGE_TERMS_CD) {
				getPersonTermsList()
			}
			if (corpTermsList.length < 1) {
				getCorpTermsList()
			} else if (corpTermsList.length > 0 && corpTermsList[0].grpCode !== GroupCd.CORP_USAGE_TERMS_CD) {
				getCorpTermsList()
			}
		}, []),
	)

	/*
	 * 이용정보 리스트 Pre fetch
	 */
	async function getPersonTermsList() {
		try {
			await GET_PERSONAL_TERMS_LIST(termsDispatch, { grpCode: GroupCd.PERSON_USAGE_TERMS_CD })
		} catch (err) {
			console.log(err)
		}
	}

	/*
	 * 이용정보 리스트 Pre fetch
	 */
	async function getCorpTermsList() {
		try {
			await GET_CORP_TERMS_LIST(termsDispatch, { grpCode: GroupCd.CORP_USAGE_TERMS_CD })
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<>
			<ScrollView
				nestedScrollEnabled={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				// nestedScrollEnabled={true}
				// keyboardDismissMode="on-drag"
				keyboardShouldPersistTaps="handled"
			>
				<View>
					<MainBtn onPress={() => replace(MAIN_TAB_FLOW, { screen: MAIN_SCREEN })}>
						<SmallText style={{ ...styles.topFont }}>{'둘러보기'}</SmallText>
					</MainBtn>
				</View>
				<Container>
					<Logo
						width={moderateScale(60)}
						height={moderateScale(76)}
						source={require('@assets/images/logo_2.png')}
					/>

					<Title style={styles.titleStyle}>회원가입</Title>

					<PersonalButton onPress={() => navigate(PERSON_SIGN_UP_TERMS_SCREEN)}>
						<SmallText style={styles.personalStyle}> 개인 회원가입</SmallText>
					</PersonalButton>

					<CorpButton onPress={() => navigate(CORP_SIGN_UP_TERMS_SCREEN)}>
						<SmallText style={styles.corpStyle}>법인 회원가입</SmallText>
					</CorpButton>
					<LoginBtn onPress={() => navigate(SIGN_IN_SCREEN)}>
						<SmallText style={{ ...styles.font14 }}>{'이미 회원이신가요?'}</SmallText>
					</LoginBtn>
				</Container>
			</ScrollView>
		</>
	)
}
const styles = StyleSheet.create({
	titleStyle: {
		marginTop: verticalScale(16),
		color: theme.colors.text,
		// height: verticalScale(23),
		// width: horizontalScale(68),
		fontSize: moderateScale(20),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	personalStyle: {
		fontSize: moderateScale(16),
		color: theme.colors.white,
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	corpStyle: {
		fontSize: moderateScale(16),
		color: theme.colors.turquoise,
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	font14: {
		fontSize: moderateScale(14),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		color: theme.colors.darkGray,
	},
	topFont: {
		fontSize: moderateScale(14),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
		color: theme.colors.text2,
	},
})
