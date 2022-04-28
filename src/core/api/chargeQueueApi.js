import { authClient } from '../config/axios'

const BASE_PATH = '/charge-queue'
const GET_CHARGE_QUEUE_RETURN = `${BASE_PATH}/return/data`
const POST_CHARGE_QUEUE_SAVE = `${BASE_PATH}/save`
const GET_CHARGE_QUEUE_REGISTRATION = `${BASE_PATH}/registration/data`
const GET_CHARGING_DATA = `${BASE_PATH}/charging/data`
const PATCH_SEND_STEVE = `${BASE_PATH}/send/steve`

/*
 * 대기열 반환 상태에서 데이터 가져오기
 * param: userId
 * return: ComeBackResponse
 */
export async function getChargeQueueReturn({ userId }) {
	return await authClient.get(GET_CHARGE_QUEUE_RETURN, {
		params: {
			userId,
		},
	})
}

/*
 * 대기열 저장
 * param userId, stationId, userEvId, status, startDate, expireDate
 * return: ComeBackResponse
 */
export async function postChargeQueue(chargeQueueInfo) {
	return await authClient.post(POST_CHARGE_QUEUE_SAVE, chargeQueueInfo)
}

/*
 * 대기열 접수 데이터 가져오기
 * return: MyQueueResponse
 */
export async function getRegistrationData() {
	return await authClient.get(GET_CHARGE_QUEUE_REGISTRATION)
}

/*
 * 충전중인 데이터 가져오기
 * return: ChargingResponse
 */
export async function getChargingData() {
	return await authClient.get(GET_CHARGING_DATA)
}

/**
 * 예약중지(CANCELED) / 차밥주기(CHARGING) / 차밥그만주기(COMPLETE)
 */
export async function patchSendSteve({ status }) {
	return await authClient.patch(`${PATCH_SEND_STEVE}/${status}`)
}
