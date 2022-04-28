import React from 'react'
import styled from 'styled-components/native'
import { horizontalScale, moderateScale, verticalScale } from '@theme/scaling'
import SettingMainAccountMngt from './main/accountMngt/SettingMainAccountMngt'
import SettingMainPayMngt from './main/payMngt/SettingMainPayMngt'
import SettingMainCarMngt from './main/carMngt/SettingMainCarMngt'
import SettingMainAlarm from './main/alarm/SettingMainAlarm'
import SettingMainUsageInfo from './main/usageInfo/SettingMainUsageInfo'
import { theme } from '@/theme'
import { ArrowNextSvg } from '@util/svgUtil'
import { StyleSheet } from 'react-native'

const Container = styled.ScrollView`
	flex: 1;
	padding: ${verticalScale(16)}px ${horizontalScale(24)}px;
	background-color: ${theme.colors.background};
`

const Contents = styled.View`
	flex: 1;
	padding-bottom: ${verticalScale(30)}px;
`

const SubTitleView = styled.View`
	padding-left: ${moderateScale(2)}px;
	padding-bottom: ${verticalScale(8)}px;
`

const ItemView = styled.View`
	width: 100%;
	padding: ${verticalScale(16)}px ${horizontalScale(16)}px;
	border-width: ${verticalScale(1)}px;
	border-color: ${theme.colors.background};
	border-radius: ${moderateScale(5)}px;
	background-color: ${theme.colors.white};
`

const Pressable = styled.Pressable`
	justify-content: space-between;
	flex-direction: row;
	align-items: center;
`

const Line = styled.View`
	padding: ${moderateScale(6)}px;
`

const parents = { Contents, SubTitleView, ItemView, Pressable, NextImg, Line }

function NextImg() {
	return <ArrowNextSvg width={moderateScale(6)} height={moderateScale(10)} />
}

export default function SettingMain() {
	return (
		<Container showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
			{/* 계정관리 */}
			<SettingMainAccountMngt parents={parents} styles={styles} />
			{/* 결제 및 할인 */}
			<SettingMainPayMngt parents={parents} styles={styles} />
			{/* 등록차량 관리 */}
			<SettingMainCarMngt parents={parents} styles={styles} />
			{/* 알림 */}
			<SettingMainAlarm parents={parents} styles={styles} />
			{/* 이용 정보 */}
			<SettingMainUsageInfo parents={parents} styles={styles} />
		</Container>
	)
}

const styles = StyleSheet.create({
	subTitleText: {
		fontSize: moderateScale(16),
		fontFamily: theme.fonts.spoqaHanSansNeo.bold,
	},
	itemText: {
		color: theme.colors.text,
		fontSize: moderateScale(14),
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	versionText: {
		color: theme.colors.turquoise,
		fontSize: moderateScale(14),
	},
})
