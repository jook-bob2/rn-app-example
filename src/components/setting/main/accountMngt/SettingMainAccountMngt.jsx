import Paragraph from '@/components/ui/text/Paragraph'
import Subtitle from '@/components/ui/text/Subtitle'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
//import { useUser } from '@/core/store/common/providers/UserProvider'
import constants from '@/navigations/constants'
import { useNavigation } from '@react-navigation/core'
import React from 'react'

const { MY_CHABAP_TAB_FLOW, MY_INFO_MODIFY_SCREEN, MY_INFO_CHANGE_PASSWORD_SCREEN } = constants

export default function SettingMainAccountMngt({ parents, styles }) {
	const { Contents, SubTitleView, ItemView, Pressable, NextImg, Line } = parents
	const { navigate } = useNavigation()

	return (
		<Contents>
			<SubTitleView>
				<Subtitle style={styles.subTitleText}>계정관리</Subtitle>
			</SubTitleView>
			<ItemView>
				<Pressable onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: MY_INFO_MODIFY_SCREEN })}>
					<Left>
						<Paragraph style={styles.itemText}>회원정보 수정</Paragraph>
					</Left>
					<Right>
						<NextImg />
					</Right>
				</Pressable>
			</ItemView>
			<Line />
			<ItemView>
				<Pressable onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: MY_INFO_CHANGE_PASSWORD_SCREEN })}>
					<Left>
						<Paragraph style={styles.itemText}>비밀번호 재설정</Paragraph>
					</Left>
					<Right>
						<NextImg />
					</Right>
				</Pressable>
			</ItemView>
		</Contents>
	)
}
