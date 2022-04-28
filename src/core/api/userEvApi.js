import { authClient } from '../config/axios'

const BASE_PATH = '/user-ev'
const ADD_EV = `${BASE_PATH}/add-ev`
const USER_SIGN_UP_EV_LIST = `${BASE_PATH}/ev-list`
const USER_EV_INFO = `${BASE_PATH}/ev-info`
const USER_EV_MODIFY = `${BASE_PATH}/ev-modify`
const USER_EV_DELETE = `${BASE_PATH}/ev-delete`
/**
 * 모든 차량 목록 (본인 + 공유)
 */
export async function getUserEvList() {
	return await authClient.get(BASE_PATH)
}

/**
 * 본인 차량 목록
 */
export async function getMyEvList() {
	return await authClient.get(BASE_PATH, {
		params: {
			searchType: 'my',
		},
	})
}

/**
 * 공유 차량 목록
 */
export async function getSharedEvList() {
	return await authClient.get(BASE_PATH, {
		params: {
			searchType: 'shared',
		},
	})
}

/**
 * 공유 차량 목록
 */
export async function getSharedUserEvList({ searchType }) {
	return await authClient.get(BASE_PATH, {
		params: {
			searchType,
		},
	})
}

/**
 * 보유한 차량에 공유된 회원 목록
 */
export async function getSharedUserList({ userEvId }) {
	return await authClient.get(`${BASE_PATH}/${userEvId}/shared-user`)
}

/**
 * 공유하기/공유받기 요청받은 목록
 */
export async function getReceivedShareList({ userId }) {
	return await authClient.get(`${BASE_PATH}/received-share/${userId}`)
}

/**
 * 공유 보내기
 */
export async function postSendShare(shareRequest) {
	return await authClient.post(`${BASE_PATH}/send-share`, shareRequest)
}

/**
 * 공유 요청 거절
 */
export async function patchRefuseShare({ shareQueueId }) {
	return await authClient.patch(`${BASE_PATH}/refuse-share/${shareQueueId}`)
}

/**
 * 공유 비밀번호 확인
 */
export async function getCheckSharePassword({ shareQueueId, passwd }) {
	return await authClient.get(`${BASE_PATH}/check-share/${shareQueueId}`, {
		params: {
			passwd,
		},
	})
}

/**
 * 공유 승인
 */
export async function postApproveShare(approveRequest) {
	return await authClient.post(`${BASE_PATH}/approve-share`, approveRequest)
}

/**
 * 공유 중단 (공유한 사람이)
 */
export async function patchStopShare({ userEvShareId }) {
	return await authClient.patch(`${BASE_PATH}/stop-share/${userEvShareId}`)
}

/**
 * 공유 해제 (공유 받은 사람이)
 */
export async function patchReleaseShare({ userEvShareId }) {
	return await authClient.patch(`${BASE_PATH}/release-share/${userEvShareId}`)
}

/**
 *  차량 등록
 *
 */
export async function postAddEv(addUserEvRequest) {
	return await authClient.post(ADD_EV, addUserEvRequest)
}

/**
 * 회원 차량 목록
 */
export async function getNewUserEvList() {
	return await authClient.get(USER_SIGN_UP_EV_LIST)
}

/**
 * 회원 차량 정보
 */
export async function getUserEvInfo({ id }) {
	return await authClient.get(USER_EV_INFO, { params: { id } })
}

/**
 *  차량 수정
 *
 */
export async function patchUserEvInfo(userEvRequest) {
	return await authClient.patch(USER_EV_MODIFY, userEvRequest)
}

/**
 *  차량 수정
 *
 */
export async function deleteUserEv(userEvRequest) {
	return await authClient.patch(USER_EV_DELETE, userEvRequest)
}

/**
 * 회원 차량 목록 (차량 관리)
 */
export async function getUserMyEvList({ searchType }) {
	return await authClient.get(BASE_PATH, {
		params: {
			searchType,
		},
	})
}
