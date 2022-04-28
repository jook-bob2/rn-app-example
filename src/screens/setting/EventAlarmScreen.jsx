import SettingEventAlarm from '@/components/setting/SettingEventAlarm'
import React from 'react'
import AuthContainer from '../AuthContainer'

export default function EventAlarmScreen() {
	return (
		<AuthContainer>
			<SettingEventAlarm />
		</AuthContainer>
	)
}
