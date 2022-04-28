import { authClient } from '../config/axios'

const BASE_PATH = '/user-fav'
const GET_STATION = '/station'
const GET_FAVORITE_STATION_NORMAL_LIST = `${BASE_PATH + GET_STATION}/normal/list`
const GET_FAVORITE_STATION_PAGING_LIST = `${BASE_PATH + GET_STATION}/paging/list`
const GET_FAVORITE_STATION_LIST = `${BASE_PATH + GET_STATION}/favorite/list`
const GET_FAVORITE_STATION = `${BASE_PATH + GET_STATION}/favorite/info`
const POST_BOOK_MARK_STATION_INSERT = `${BASE_PATH + GET_STATION}/bookmark/insert`
const DELETE_FAVORITE_STATION = `${BASE_PATH + GET_STATION}/favorite/delete`
const UPDATE_FAVORITE_STATION = `${BASE_PATH + GET_STATION}/favorite/update`

/*
 * 즐겨찾기 일반 리스트 조회
 * param: userId
 * return: List
 */
export async function getFavoriteStationNormalList({ userId }) {
	return await authClient.get(GET_FAVORITE_STATION_NORMAL_LIST, {
		params: {
			userId,
		},
	})
}

/*
 * 즐겨찾기 페이징 리스트 조회
 * param: userId, page, size, sort
 * return: Page
 */
export async function getFavoriteStationPagingList({ userId, page, size, sort }) {
	return await authClient.get(GET_FAVORITE_STATION_PAGING_LIST, {
		params: {
			userId,
			page,
			size,
			sort,
		},
	})
}
/*
 * 즐겨찾기 등록
 * param: insertRequest
 */
export async function postBookMarkInsert(insertRequest) {
	return await authClient.post(POST_BOOK_MARK_STATION_INSERT, insertRequest)
}

/*
 * 즐겨찾기 등록된 리스트 조회
 * param: userId
 * return: List
 */
export async function getFavoriteStationList({ userId }) {
	return await authClient.get(GET_FAVORITE_STATION_LIST, {
		params: {
			userId,
		},
	})
}

/*
 * 즐겨찾기 등록된 리스트 조회
 * param: userId, id
 */
export async function getFavoriteStation({ id, userId }) {
	return await authClient.get(GET_FAVORITE_STATION, {
		params: {
			id,
			userId,
		},
	})
}

/*
 * 즐겨찾기 삭제
 * param: bookMarkRequest
 */
export async function deleteFavoriteStation({ id, userId }) {
	return await authClient.delete(DELETE_FAVORITE_STATION, {
		params: {
			id,
			userId,
		},
	})
}
/*즐겨찾기 수정*/
export async function patchFavoriteStation(updateRequest) {
	return await authClient.patch(UPDATE_FAVORITE_STATION, updateRequest)
}

/**
 * 즐겨찾기 등록/삭제 Toggle
 */
export async function postToggleBookMark(toggleRequest) {
	return await authClient.post(`${BASE_PATH}/toggle`, toggleRequest)
}
