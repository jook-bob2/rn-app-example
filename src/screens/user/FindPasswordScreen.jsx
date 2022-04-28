import UserFindStep from '@/components/user/UserFindStep'
import userConst from '@/constants/userConst'
import { useRoute } from '@react-navigation/native'
import React from 'react'
const { USER_FIND_PWD } = userConst
/*
 * 비밀번호 찾기 스크린
 */
export default function FindPasswordScreen() {
	const { params } = useRoute()
	return <UserFindStep reqType={USER_FIND_PWD} params={params} />
}
