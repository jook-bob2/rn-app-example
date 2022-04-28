import UserFindStep from '@/components/user/UserFindStep'
import userConst from '@/constants/userConst'
import React from 'react'
const { USER_FIND_ID } = userConst
/*
 * 아이디 찾기 스크린
 */
export default function FindIdScreen() {
	return <UserFindStep reqType={USER_FIND_ID} />
}
