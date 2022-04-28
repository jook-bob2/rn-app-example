import { authClient, noneAuthClient } from '../config/axios'

const BASE_PATH = '/connector'
const GET_CONNECTOR_STATUS = `${BASE_PATH}/status`
const GET_STATUS_AVAILABLE = `${GET_CONNECTOR_STATUS}/available`

/*
 * 연결 상태 조회
 * param: userId
 * return: Integer
 */
export async function getConnectorStatus({ userId, userEvId }) {
	return await noneAuthClient.get(GET_CONNECTOR_STATUS, {
		params: {
			userId,
			userEvId,
		},
	})
}

/*
 * 예약 후 충전 가능 여부 조회
 * return: Boolean
 */
export async function getStatusAvailable() {
	return await authClient.get(GET_STATUS_AVAILABLE)
}
