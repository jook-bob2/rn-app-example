import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/core'
import React, { useCallback } from 'react'
import moment from 'moment'
import Link from '@/components/ui/Link'
import { useBoxOfficeContext } from '@/core/store/api/providers/BoxOfficeApiProvider'
import { GET_BOX_OFFICE_DETAIL } from '@/core/store/api/create/boxOfficeCreate'
import Loading from '@/components/ui/Loading'
import styled from 'styled-components/native'
import Paragraph from '@/components/ui/text/Paragraph'
import { theme } from '@/theme'
import { StyleSheet } from 'react-native'
import Row from '@/components/ui/view/Row'

const Container = styled.View`
	padding: 20px;
`
export default function BoxOfficeDetail() {
	const { params } = useRoute()
	const navigation = useNavigation()
	const { state, dispatch } = useBoxOfficeContext()
	const { data, loading, error } = state.BoxOfficeDetail

	useFocusEffect(
		useCallback(() => {
			getBoxOfficeDetail()
		}, [params]),
	)

	async function getBoxOfficeDetail() {
		if (params.movieCd) {
			try {
				const response = await GET_BOX_OFFICE_DETAIL(dispatch, {
					movieCd: params.movieCd,
				})

				navigation.setOptions({
					title: response.data.movieInfoResult.movieInfo.movieNm,
				})
			} catch (err) {
				console.log(err)
			}
		}
	}

	if (error) return <Paragraph>{error}</Paragraph>

	const detail = data?.movieInfoResult?.movieInfo || {}

	return (
		<>
			{loading && !data && <Loading />}
			<Container>
				<Row>
					<Paragraph>
						영화명 : <Paragraph style={styles.text}>{detail.movieNm}</Paragraph>
					</Paragraph>
				</Row>
				<Row>
					<Paragraph>
						상영시간 : <Paragraph style={styles.text}>{detail.showTm}분</Paragraph>
					</Paragraph>
				</Row>
				<Row>
					<Paragraph>
						개봉일 :{' '}
						<Paragraph style={styles.text}>{moment(detail.openDt).format('YYYY년 MM월 DD일')}</Paragraph>
					</Paragraph>
				</Row>
				<Row>
					<Paragraph>
						감독 :{' '}
						{detail?.directors?.map((director, index) => (
							<Link
								key={index}
								onPress={() => {
									navigation.navigate('BoxOfficeSearchResultScreen', {
										peopleNm: director.peopleNm,
									})
								}}
							>
								{director.peopleNm}
							</Link>
						))}
					</Paragraph>
				</Row>
				<Row>
					<Paragraph>
						출연 :{' '}
						{detail?.actors?.map((actor, index) => (
							<Link
								key={index}
								onPress={() => {
									navigation.navigate('BoxOfficeSearchResultScreen', {
										peopleNm: actor.peopleNm,
									})
								}}
							>
								{actor.peopleNm}
							</Link>
						))}
					</Paragraph>
				</Row>
			</Container>
		</>
	)
}

const styles = StyleSheet.create({
	text: {
		fontFamily: theme.fonts.spoqaHanSansNeo.regular,
	},
	test: {
		top: 0,
		bottom: 5,
	},
})
