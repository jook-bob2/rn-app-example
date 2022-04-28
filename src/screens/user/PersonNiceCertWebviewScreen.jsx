import UserNiceCertWebview from '@/components/user/UserNiceCertWebview'
import userConst from '@/constants/userConst'
import { useRoute } from '@react-navigation/native'
import React from 'react'

const { USER_PERSONAL } = userConst

export default function PersonNiceCertWebviewScreen() {
	const { params } = useRoute()
	return <UserNiceCertWebview reqType={USER_PERSONAL} params={params} />
}
