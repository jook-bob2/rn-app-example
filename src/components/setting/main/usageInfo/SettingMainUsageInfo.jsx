import Paragraph from '@/components/ui/text/Paragraph'
import Subtitle from '@/components/ui/text/Subtitle'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import { theme } from '@/theme'
import { horizontalScale, moderateScale, verticalScale } from '@/theme/scaling'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'
import VersionInfo from 'react-native-version-info'
import constants from '@/navigations/constants'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { GET_TERMS_LIST } from '@/core/store/api/create/termsCreate'
import { useTermsContext } from '@/core/store/api/providers/TermsApiProvider'
import { GroupCd } from '@/constants/termsConst'

const { MY_CHABAP_TAB_FLOW, TERMS_USE_SCREEN } = constants

const VersionView = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: ${verticalScale(13)}px ${horizontalScale(16)}px;
	border-width: ${verticalScale(1)}px;
	border-color: ${theme.colors.background};
	border-radius: ${moderateScale(5)}px;
	background-color: ${theme.colors.white};
`

export default function SettingMainUsageInfo({ parents, styles }) {
	const { Contents, SubTitleView, ItemView, Pressable, NextImg, Line } = parents
	const { navigate } = useNavigation()

	const { state: termsState, dispatch: termsDispatch } = useTermsContext()
	const usageList = termsState.termsList.data?.data || [] // 이용정보 리스트

	/*
	 * 이용정보 리스트 함수 Call
	 */
	useFocusEffect(
		useCallback(() => {
			if (usageList.length < 1) {
				getTermsUseList()
			} else if (usageList.length > 0 && usageList[0].grpCode !== GroupCd.USAGE_INFO_CD) {
				getTermsUseList()
			}
		}, []),
	)

	/*
	 * 이용정보 리스트 Pre fetch
	 */
	async function getTermsUseList() {
		try {
			await GET_TERMS_LIST(termsDispatch, { grpCode: GroupCd.USAGE_INFO_CD })
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<Contents>
			<SubTitleView>
				<Subtitle style={styles.subTitleText}>이용정보</Subtitle>
			</SubTitleView>
			<ItemView>
				<Pressable onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: TERMS_USE_SCREEN })}>
					<Left>
						<Paragraph style={styles.itemText}>이용약관</Paragraph>
					</Left>
					<Right>
						<NextImg />
					</Right>
				</Pressable>
			</ItemView>
			<Line />
			<VersionView>
				<Left>
					<Paragraph style={styles.itemText}>버전정보</Paragraph>
				</Left>
				<Right>
					<Paragraph style={styles.versionText}>{VersionInfo.appVersion}</Paragraph>
				</Right>
			</VersionView>
		</Contents>
	)
}
