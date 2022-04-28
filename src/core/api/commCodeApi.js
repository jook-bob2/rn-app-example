import { noneAuthClient } from '../config/axios'

const BASE_PATH = '/comm-code'
const SEARCH_LIST = `${BASE_PATH}/search/list`

/*
 * 공통코드 조회
 * param: code
 * return: { "id": int, "code": string, "codeName": string }
 */
export async function getCommCodeSearchList({ code }) {
	return await noneAuthClient.get(SEARCH_LIST, {
		params: {
			code,
		},
	})
}
