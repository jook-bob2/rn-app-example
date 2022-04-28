import React, { memo, useCallback } from 'react'
import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import styled from 'styled-components/native'
import Paragraph from '@/components/ui/text/Paragraph'
import Row from '@/components/ui/view/Row'
import { theme } from '@/theme'

const ItemView = styled.View`
	padding: 12px;
`

const MemorizedRankIntentIcon = memo(function RankIntenIcon({ rankInten }) {
	if (Number(rankInten) > 0) {
		return '🔼'
	} else if (Number(rankInten) < 0) {
		return '🔽'
	}
	return '⏺'
})

export default function BoxOfficeListItem({ data }) {
	const { navigate } = useNavigation()

	const navigateMovieDetail = useCallback(
		(movieCd) => {
			navigate('BoxOfficeDetailScreen', { movieCd })
		},
		[navigate],
	)

	return (
		<Pressable onPress={() => navigateMovieDetail(data.movieCd)}>
			<ItemView>
				<Row>
					<Paragraph>{data.rank}위 </Paragraph>
					<Paragraph>
						<MemorizedRankIntentIcon rankInten={data.rankInten} />
						<Paragraph style={{ color: theme.colors.error }}>[{Number(data.rankInten)}] </Paragraph>
					</Paragraph>
					<Paragraph>{data.movieNm}</Paragraph>
					<Paragraph>{data.rankOldAndNew === 'NEW' ? '🆕' : ''}</Paragraph>
				</Row>
			</ItemView>
		</Pressable>
	)
}
