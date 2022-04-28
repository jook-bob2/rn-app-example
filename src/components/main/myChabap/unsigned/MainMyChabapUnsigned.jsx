import React from 'react'
import constants from '@/navigations/constants'
import { useNavigation } from '@react-navigation/core'
import { Platform } from 'react-native'
import styled from 'styled-components/native'
import { useConnector } from '@/core/store/common/providers/ConnectorStatusProvider'
import ResponsiveImg from '@/components/ui/image/ResponsiveImg'

const { AUTH_STACK_FLOW, SIGN_UP_SELECTION_SCREEN } = constants

const ImageButton = styled.TouchableOpacity`
	align-items: center;
`

export default function MainMyChabapUnsigned() {
	const { navigate } = useNavigation()
	const { loading } = useConnector()

	return (
		<ImageButton onPress={() => navigate(AUTH_STACK_FLOW, { screen: SIGN_UP_SELECTION_SCREEN })}>
			{loading ? (
				<></>
			) : (
				<>
					{Platform.OS === 'ios' ? (
						<ResponsiveImg source={require('@assets/images/unsigned_ios.png')} width={358} height={240} />
					) : (
						<ResponsiveImg
							source={require('@assets/images/unsigned_android.png')}
							width={320}
							height={201}
						/>
					)}
				</>
			)}
		</ImageButton>
	)
}
