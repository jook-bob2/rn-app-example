import { noneAuthClient } from '../config/axios'
const FIND_USER_ADDRESS = `/user-addr/search/result`

/*주소 찾기*/
export async function getAddress({ keyword, currentPage, countPerPage }) {
	return await noneAuthClient.get(FIND_USER_ADDRESS, {
		params: {
			keyword,
			currentPage,
			countPerPage,
		},
	})
}
