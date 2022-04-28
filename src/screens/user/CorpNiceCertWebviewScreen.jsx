import UserNiceCertWebview from '@/components/user/UserNiceCertWebview'
import userConst from '@/constants/userConst'
import { useRoute } from '@react-navigation/native'
import React from 'react'

const { USER_CORPORATION } = userConst

export default function CorpNiceCertWebviewScreen() {
	const { params } = useRoute()
	return <UserNiceCertWebview reqType={USER_CORPORATION} params={params} />
}
