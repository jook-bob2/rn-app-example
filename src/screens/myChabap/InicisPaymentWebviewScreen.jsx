import { useRoute } from '@react-navigation/native'
import React from 'react'
import InicisPaymentWebview from '@/components/myChabap/InicisPaymentWebview'

export default function InicisPaymentWebviewScreen() {
	const { params } = useRoute()
	return <InicisPaymentWebview params={params} />
}
