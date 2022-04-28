import UserNiceCertWebview from '@/components/user/UserNiceCertWebview'
import userConst from '@/constants/userConst'
import { useRoute } from '@react-navigation/native'
import React from 'react'
const { CORP_PERSONAL_MODIFY } = userConst

/*
 * 법인수정 나이스 재인증 스크린
 */
export default function MyInfoVerifyCorpScreen() {
	const { params } = useRoute()
	return <UserNiceCertWebview reqType={CORP_PERSONAL_MODIFY} params={params} />
}
