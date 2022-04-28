import React from 'react'
import InicisWpayCardRegWebview from '@/components/myChabap/InicisWpayCardRegWebview'
import { useRoute } from '@react-navigation/native'

export default function InicisWpayCardRegWebviewScreen() {
	const { params } = useRoute()
	return <InicisWpayCardRegWebview params={params} />
}
