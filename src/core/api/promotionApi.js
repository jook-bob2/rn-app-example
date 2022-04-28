import { noneAuthClient } from '../config/axios'

const BASE_PATH = '/promotion'
const GET_PROMOTION_LIST_PAGE = `${BASE_PATH}/list/page`

/*
 * 프로모션 페이징 리스트 조회
 * param: pageable(page, size), filepath, platform, isEnd
 * return: pageable 데이터
 */
export async function getPromotionList({ page, size, platform, filepath, isEnd }) {
	return await noneAuthClient.get(GET_PROMOTION_LIST_PAGE, {
		params: {
			page,
			size,
			platform,
			filepath,
			isEnd,
		},
	})
}
