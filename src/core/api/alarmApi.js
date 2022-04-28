import { authClient } from '../config/axios'

const BASE_PATH = '/alarm'
const GET_ALARM = `${BASE_PATH}/check`
const PUT_ALARM = `${BASE_PATH}/selected`

/*
 * 알림 여부 조회
 * param: userId
 * return: alarm info
 */
export async function getAlarmCheck({ userId }) {
	return await authClient.get(GET_ALARM, {
		params: {
			userId,
		},
	})
}

/*
 * 선택된 알림 추가/수정
 * param: selectedRequest(id, userId, pushFlag, smsFlag, emailFlag)
 * return: boolean
 */
export async function putAlarmSelected(selectedRequest) {
	return await authClient.put(PUT_ALARM, selectedRequest)
}
