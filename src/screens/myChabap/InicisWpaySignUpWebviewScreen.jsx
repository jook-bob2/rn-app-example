import React from 'react'
import InicisWpaySignUpWebview from '@/components/myChabap/InicisWpaySignUpWebview'
import { useRoute } from '@react-navigation/native'

export default function InicisWpaySignUpWebviewScreen() {
	const { params } = useRoute()
	return <InicisWpaySignUpWebview params={params} />
}
