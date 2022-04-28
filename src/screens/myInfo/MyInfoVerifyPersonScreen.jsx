import UserNiceCertWebview from '@/components/user/UserNiceCertWebview'
import userConst from '@/constants/userConst'
import { useRoute } from '@react-navigation/native'
import React from 'react'
const { USER_PERSONAL_MODIFY } = userConst

/*
 * 개인정보 재인증 스크린
 */
export default function MyInfoVerifyPersonScreen() {
	const { params } = useRoute()
	return <UserNiceCertWebview reqType={USER_PERSONAL_MODIFY} params={params} />
}
