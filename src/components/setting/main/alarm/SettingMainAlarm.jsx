import Paragraph from '@/components/ui/text/Paragraph'
import Subtitle from '@/components/ui/text/Subtitle'
import Left from '@/components/ui/view/Left'
import Right from '@/components/ui/view/Right'
import React from 'react'
import constants from '@/navigations/constants'
import { useNavigation } from '@react-navigation/core'

const { MY_CHABAP_TAB_FLOW, EVENT_ALARM_SCREEN } = constants

export default function SettingMainAlarm({ parents, styles }) {
	const { Contents, SubTitleView, ItemView, Pressable, NextImg } = parents
	const { navigate } = useNavigation()
	return (
		<Contents>
			<SubTitleView>
				<Subtitle style={styles.subTitleText}>알림</Subtitle>
			</SubTitleView>
			<ItemView>
				<Pressable onPress={() => navigate(MY_CHABAP_TAB_FLOW, { screen: EVENT_ALARM_SCREEN })}>
					<Left>
						<Paragraph style={styles.itemText}>혜택 알림 설정</Paragraph>
					</Left>
					<Right>
						<NextImg />
					</Right>
				</Pressable>
			</ItemView>
		</Contents>
	)
}
