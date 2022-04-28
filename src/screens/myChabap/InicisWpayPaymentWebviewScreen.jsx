import React from 'react'
import InicisWpayPaymentWebview from '@/components/myChabap/InicisWpayPaymentWebview'
import { useRoute } from '@react-navigation/native'

export default function InicisWpayPaymentWebviewScreen() {
	const { params } = useRoute()
	return <InicisWpayPaymentWebview params={params} />
}
