import { authClient, noneAuthClient } from '../config/axios'

const BASE_PATH = '/station'
const GET_NEAR_STATION_PAGING_LIST = `${BASE_PATH}/near/paging/list`
const GET_FIND_ROAD = `${BASE_PATH}/find/road`
const GET_USER_STATION_LIST = `${BASE_PATH}/favor/list`

/**
 * 차밥 충전소 리스트
 * @param {userId, distance, latitude, longitude, searchString}
 * @returns
 */
export async function getStationList({ userId, distance, latitude, longitude, searchString }) {
	return await noneAuthClient.get(BASE_PATH, {
		params: {
			userId: userId === 0 ? null : userId,
			distance,
			latitude,
			longitude,
			searchString,
		},
	})
}

export async function getStationDetail({ userId, stationId, latitude, longitude }) {
	return await noneAuthClient.get(`${BASE_PATH}/detail`, {
		params: {
			userId: userId === 0 ? null : userId,
			stationId,
			latitude,
			longitude,
		},
	})
}

export async function getStationWaiting({ stationId, chargeSpeed }) {
	return await noneAuthClient.get(`${BASE_PATH}/waiting`, {
		params: {
			stationId,
			chargeSpeed,
		},
	})
}

export async function postStationCharge(chargeRequest) {
	return await authClient.post(`${BASE_PATH}/charge`, chargeRequest)
}

/* -- 삭제할것 ---
 * 가장 가까운 차밥 충전소 리스트
 * param: latitude, longitude, distanceRadius, size, page
 * return: Page
 */
export async function getNearStationPagingList({ userId, userEvId, latitude, longitude, distance, size, page }) {
	return await noneAuthClient.get(GET_NEAR_STATION_PAGING_LIST, {
		params: {
			userId: userId === 0 ? null : userId,
			userEvId,
			latitude,
			longitude,
			distance,
			size,
			page,
		},
	})
}

/*
 * 길찾기 정보
 * param:
 * return: Station.Info
 */
export async function getFindRoad() {
	return await authClient.get(GET_FIND_ROAD)
}

/**
 * 길찾기 요청 데이터 가져오기
 */
export async function getFindRoadReqData({ stationId }) {
	return await noneAuthClient.get(`${BASE_PATH}/${stationId}/find/road/req`)
}

/**
 * 차밥 충전소 리스트 (즐겨찾기)
 * @param {userId, distance, latitude, longitude, searchString}
 * @returns
 */
export async function getStationListForFavor({ userId, distance, latitude, longitude, searchString }) {
	return await authClient.get(GET_USER_STATION_LIST, {
		params: {
			userId,
			distance,
			latitude,
			longitude,
			searchString,
		},
	})
}
