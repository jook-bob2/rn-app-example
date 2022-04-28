import UserSignUpStep from '@/components/user/UserSignUpStep'
import React, { useCallback } from 'react'
import { useCommCodeContext } from '@/core/store/api/providers/CommCodeApiProvider'
import { useFocusEffect } from '@react-navigation/core'
import commCodeConst from '@/constants/commCodeConst'
import { GET_COMM_CODE_SEARCH_LIST } from '@/core/store/api/create/commCodeCreate'
import Paragraph from '@/components/ui/text/Paragraph'
import Loading from '@component/ui/Loading'

const { USER_TYPE_CD } = commCodeConst

/*
 * 개인회원가입 스탭 스크린
 */
export default function PersonSignUpStepScreen() {
	const { state, dispatch } = useCommCodeContext()
	const { data, loading, error } = state.commCodeSearchList

	useFocusEffect(
		useCallback(() => {
			getCommCodeList()
		}, []),
	)

	async function getCommCodeList() {
		try {
			await GET_COMM_CODE_SEARCH_LIST(dispatch, {
				code: USER_TYPE_CD,
			})
		} catch (e) {
			console.log(e)
		}
	}

	if (loading) return <Loading />
	if (error) return <Paragraph>{error}</Paragraph>

	return <UserSignUpStep userType={data?.data[0]?.code} />
}
