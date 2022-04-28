import Paragraph from '@/components/ui/text/Paragraph'
import Subtitle from '@/components/ui/text/Subtitle'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import React from 'react'
import constants from '@/navigations/constants'
import { useNavigation } from '@react-navigation/core'

const { MY_CHABAP_TAB_FLOW, MY_INFO_CHANGE_CARD_INFO_SCREEN } = constants

export default function SettingMainPayMngt({ parents, styles }) {
	const { Contents, SubTitleView, ItemView, Pressable, NextImg } = parents
	const { navigate } = useNavigation()

	return (
		<Contents>
			<SubTitleView>
				<Subtitle style={styles.subTitleText}>결제 및 할인</Subtitle>
			</SubTitleView>
			<ItemView>
				<Pressable onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: MY_INFO_CHANGE_CARD_INFO_SCREEN })}>
					<Left>
						<Paragraph style={styles.itemText}>결제수단 관리</Paragraph>
					</Left>
					<Right>
						<NextImg />
					</Right>
				</Pressable>
			</ItemView>
		</Contents>
	)
}
