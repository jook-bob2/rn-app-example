import React from 'react'
import { theme } from '@/theme'
import { ActivityIndicator } from 'react-native'

export default function Scrolling() {
	return (
		<>
			<ActivityIndicator size={'small'} color={theme.colors.onSurface} />
		</>
	)
}
