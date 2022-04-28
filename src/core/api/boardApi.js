import { noneAuthClient, authClient } from '../config/axios'

const BASE_PATH = '/board'
const BOARD_LIST_PAGE = `${BASE_PATH}/list/page`
const BOARD_LIST_NORMAL = `${BASE_PATH}/list/normal`
const BOARD_DETAIL = `${BASE_PATH}/detail`
const BOARD_INSERT_INQUIRY = `${BASE_PATH}/insert/inquiry`

/*
 * 게시판 페이징 리스트 조회
 * param: boardCd, keyword, pageable(page, size, sort)
 * return: pageable 데이터
 */
export async function getBoardPageList({
	boardCd,
	keyword,
	page,
	size,
	sort,
	isGroup,
	userId,
	progress,
	categoryCd,
	platform,
	filepath,
}) {
	return await noneAuthClient.get(BOARD_LIST_PAGE, {
		params: {
			boardCd,
			keyword,
			page,
			size,
			sort,
			isGroup,
			userId,
			progress,
			categoryCd,
			platform,
			filepath,
		},
	})
}

/*
 * 게시판 일반 리스트 조회
 * param: boardCd, keyword
 * return: List<>
 */
export async function getBoardNormalList({ boardCd, keyword, isGroup }) {
	return await noneAuthClient.get(BOARD_LIST_NORMAL, {
		params: {
			boardCd,
			keyword,
			isGroup,
		},
	})
}

/*
 * 게시판 상세 조회
 * param: id
 * return:
 */
export async function getBoardDetail({ id }) {
	return await noneAuthClient.get(BOARD_DETAIL, {
		params: {
			id,
		},
	})
}

/*
 * 1대1 문의 등록
 * param: inquiryInsertRequest
 * return: boolean
 */

export async function postInquiryInsert(inquiryInsertRequest) {
	return await authClient.post(BOARD_INSERT_INQUIRY, inquiryInsertRequest)
}
