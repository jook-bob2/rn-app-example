import { authClient } from '../config/axios'

const BASE_PATH = '/payment'
const GET_RECENT_CHARGE_LIST = `${BASE_PATH}/recent/charge/list`
const GET_PAYMENT_DETAIL = `${BASE_PATH}/detail`
const GET_PAYMENT_LIST = `${BASE_PATH}/list`
const GET_IS_UNPAID = `${BASE_PATH}/is-unpaid`

/*
 * 최근 충전내역 리스트
 * param: userId, size, page
 * return: List
 */
export async function getRecentChargeList({ userId, size, page }) {
	return await authClient.get(GET_RECENT_CHARGE_LIST, {
		params: {
			userId: userId === 0 ? null : userId,
			size,
			page,
		},
	})
}

/**
 * 이용내역 조회
 */
export async function getPaymentDetail({ paymentId }) {
	return await authClient.get(`${GET_PAYMENT_DETAIL}/${paymentId}`)
}

/**
 * 이용내역 리스트 조회
 */
export async function getPaymentList({ userEvId, size, page }) {
	return await authClient.get(GET_PAYMENT_LIST, {
		params: {
			userEvId: userEvId === 0 ? null : userEvId,
			size,
			page,
		},
	})
}

/**
 * 미납요금 여부 조회
 */
export async function getIsUnpaid() {
	return await authClient.get(GET_IS_UNPAID)
}
