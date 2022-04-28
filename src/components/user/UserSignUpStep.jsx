import { useCommCodeContext } from '@/core/store/api/providers/CommCodeApiProvider'
import UserNiceCertWebview from '@component/user/UserNiceCertWebview'
import { useRoute } from '@react-navigation/core'
import React from 'react'
import CommonSignUpCarAddInput from './signUpStep/common/CommonSignUpCarAddInput'
import CommonSignUpCardInput from './signUpStep/common/CommonSignUpCardInput'
import CommonSignUpCarInput from './signUpStep/common/CommonSignUpCarInput'
import CorpSignUpCorpInput from './signUpStep/corp/CorpSignUpCorpInput'
import CorpSignUpManagerInput from './signUpStep/corp/CorpSignUpManagerInput'
import CorpSignUpTerms from './signUpStep/corp/CorpSignUpTerms'
import PersonSignUpAddr from './signUpStep/person/PersonSignUpAddr'
import PersonSignUpPersonInput from './signUpStep/person/PersonSignUpPersonInput'
import PersonSignUpTerms from './signUpStep/person/PersonSignUpTerms'

export default function UserSignUpStep({ userType }) {
	const {
		params: { step },
	} = useRoute()

	const { state } = useCommCodeContext()
	const { data } = state.commCodeSearchList
	const person = data?.data[0]?.code
	const corp = data?.data[1]?.code

	/*
	 * 법인 회원 스탭
	 */
	function CorpStep() {
		switch (step) {
			case 0:
				// 법인회원 약관 컴포넌트
				return <CorpSignUpTerms />
			case 1:
				// 법인회원 인증 컴포넌트
				return <UserNiceCertWebview reqType={userType} />
			case 2:
				// 법인회원 정보 입력 컴포넌트
				return <CorpSignUpManagerInput reqType={userType} />
			case 3:
				// 법인회원 담당자 입력 컴포넌트
				return <CorpSignUpCorpInput />
			case 4:
				// 공통 차량 등록 컴포넌트
				return <CommonSignUpCarInput userType={userType} />
			case 5:
				// 공통 차량 추가 등록 컴포넌트
				return <CommonSignUpCarAddInput userType={userType} />
			case 6:
				// 공통 카드 등록 컴포넌트
				return <CommonSignUpCardInput />
			default:
				throw new Error('Corporate step error')
		}
	}

	/*
	 * 개인 회원 스탭
	 */
	function PersonStep() {
		switch (step) {
			case 0:
				// 개인회원 약관 컴포넌트
				return <PersonSignUpTerms />
			case 1:
				// 개인회원 인증 컴포넌트
				return <UserNiceCertWebview reqType={userType} />
			case 2:
				// 개인회원 정보 입력 컴포넌트
				return <PersonSignUpPersonInput reqType={userType} />
			case 3:
				// 개인회원 주소 입력 컴포넌트
				return <PersonSignUpAddr />
			case 4:
				// 공통 차량 등록 컴포넌트
				return <CommonSignUpCarInput userType={userType} />
			case 5:
				// 공통 차량 등록 추가 컴포넌트
				return <CommonSignUpCarAddInput userType={userType} />
			case 6:
				// 공통 카드 등록 컴포넌트
				return <CommonSignUpCardInput />
			default:
				throw new Error('Personal step error')
		}
	}

	return (
		<>
			{userType === undefined ? null : userType === person ? (
				<PersonStep />
			) : userType === corp ? (
				<CorpStep />
			) : (
				new Error('user type error')
			)}
		</>
	)
}
