import { noneAuthClient } from '../config/axios'

const BASE_PATH = '/terms'
const GET_TERMS_LIST = `${BASE_PATH}/list`

/*
 * 약관 리스트 조회
 * param: grpCode
 * return: pageable 데이터
 */
export async function getTermsList({ grpCode }) {
	return await noneAuthClient.get(GET_TERMS_LIST, {
		params: {
			grpCode,
		},
	})
}
