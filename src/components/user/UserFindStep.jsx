import userConst from '@/constants/userConst'
import UserNiceCertWebview from '@component/user/UserNiceCertWebview'
import { useRoute } from '@react-navigation/core'
import React from 'react'
import UserFindId from './UserFindId'
import UserFindPasswdByEmail from './UserFindPasswdByEmail'
import UserFindPassword from './UserFindPassword'

const { USER_FIND_PWD, USER_FIND_ID } = userConst

export default function UserFindStep({ reqType, params }) {
	const {
		params: { step },
	} = useRoute()

	/*아이디 찾기*/
	function findId() {
		switch (step) {
			case 0:
				//휴대폰 인증
				return <UserNiceCertWebview reqType={reqType} />
			case 1:
				//아이디 찾음 화면
				return <UserFindId reqType={reqType} />
			default:
				throw new Error('Personal step error')
		}
	}
	/*비밀번호 찾기*/
	function findPwd() {
		switch (step) {
			case 0:
				//이메일 체크
				return <UserFindPasswdByEmail />
			case 1:
				//휴대폰 인증
				return <UserNiceCertWebview reqType={reqType} params={params} />
			case 2:
				//비밀번호 재설정
				return <UserFindPassword reqType={reqType} />
			default:
				throw new Error('Personal step error')
		}
	}
	return (
		<>
			{reqType === USER_FIND_ID ? findId() : reqType === USER_FIND_PWD ? findPwd() : new Error('User type error')}
		</>
	)
}
