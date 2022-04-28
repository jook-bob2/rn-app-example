import { useFocusEffect, useRoute } from '@react-navigation/core'
import React, { useCallback } from 'react'
import { FlatList, Pressable } from 'react-native'
import styled from 'styled-components/native'
import { useBoxOfficeContext } from '@/core/store/api/providers/BoxOfficeApiProvider'
import { GET_BOX_OFFICE_PEOPLE } from '@/core/store/api/create/boxOfficeCreate'
import Loading from '@/components/ui/Loading'
import Paragraph from '@/components/ui/text/Paragraph'
import { theme } from '@/theme'

const Padding = styled.View`
	width: 100%;
	padding: 20px;
`

export default function BoxOfficeSearchResult() {
	const { params } = useRoute()
	const { state, dispatch } = useBoxOfficeContext()
	const { data, loading, error } = state.BoxOfficePeople

	useFocusEffect(
		useCallback(() => {
			getBoxOfficePeopleList()
		}, [params]),
	)

	async function getBoxOfficePeopleList() {
		if (params.peopleNm) {
			try {
				await GET_BOX_OFFICE_PEOPLE(dispatch, { peopleNm: params.peopleNm })
			} catch (err) {
				console.log(err)
			}
		}
	}

	if (error) return <Paragraph>{error}</Paragraph>

	const list = data?.peopleListResult?.peopleList || []

	return (
		<>
			{loading && !data && <Loading />}
			<Padding>
				<FlatList
					data={list}
					keyExtractor={(item) => item.peopleCd}
					renderItem={(render) => (
						<Pressable onPress={() => {}}>
							<Paragraph>
								{render.item.peopleNm} ({render.item.repRoleNm})
							</Paragraph>
							<Paragraph style={{ fontFamily: theme.fonts.spoqaHanSansNeo.light }}>
								{render.item.filmoNames}
							</Paragraph>
						</Pressable>
					)}
					refreshing={true}
				/>
			</Padding>
		</>
	)
}
