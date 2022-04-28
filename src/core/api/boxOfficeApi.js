import moment from 'moment'
import { noneAuthClient } from '@/core/config/axios'

export const kobisKey = 'b054806ba1ece8ef9f173371a1e5cb29'

// 일별 박스 오피스
const dailyUri = '/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json'
// 영화 상세 정보
const detailUri = '/kobisopenapi/webservice/rest/movie/searchMovieInfo.json'
// 영화인 정보
const peopleUri = '/kobisopenapi/webservice/rest/people/searchPeopleList.json'

// 어제
export const yesterDay = moment().subtract(1, 'day').format('YYYYMMDD')

export async function getBoxOfficeList({ targetDt }) {
	return await noneAuthClient.get(dailyUri, {
		params: {
			key: kobisKey,
			targetDt,
		},
	})
}

export async function getBoxOfficeDetail({ movieCd }) {
	return await noneAuthClient.get(detailUri, {
		params: {
			key: kobisKey,
			movieCd,
		},
	})
}

export async function getBoxOfficePeople({ peopleNm }) {
	return noneAuthClient.get(peopleUri, {
		params: {
			key: kobisKey,
			peopleNm,
		},
	})
}
