import React, { useCallback } from 'react'
import BoxOfficeListItem from './BoxOfficeListItem'
import { yesterDay } from '@/core/api/boxOfficeApi'
import { GET_BOX_OFFICE_LIST } from '@/core/store/api/create/boxOfficeCreate'
import { useBoxOfficeContext } from '@/core/store/api/providers/BoxOfficeApiProvider'
import { useFocusEffect } from '@react-navigation/core'
import Loading from '@/components/ui/Loading'
import Paragraph from '@/components/ui/text/Paragraph'

export default function BoxOfficeList() {
	const { state, dispatch } = useBoxOfficeContext()
	const { data, loading, error } = state.BoxOfficeList

	useFocusEffect(
		useCallback(() => {
			getBoxOfficeList()
		}, []),
	)

	async function getBoxOfficeList() {
		try {
			await GET_BOX_OFFICE_LIST(dispatch, { targetDt: yesterDay })
		} catch (err) {
			console.log(err)
		}
	}

	if (error) return <Paragraph>{error}</Paragraph>

	const ranks = data?.boxOfficeResult?.dailyBoxOfficeList || []

	return (
		<>
			{loading && !data && <Loading />}
			{ranks.length > 0 ? (
				ranks.map((item) => <BoxOfficeListItem key={item.rnum} data={item} />)
			) : (
				<Paragraph>데이터를 불러오는 중입니다.</Paragraph>
			)}
		</>
	)
}
