import { authClient } from '../config/axios'

const BASE_PATH = '/inicis'
const GET_WPAY_MEM_REQUEST = `${BASE_PATH}/wpay/mem-req`
const GET_WPAY_CARD_REQUEST = `${BASE_PATH}/wpay/card-req`
const GET_WPAY_CARD_LIST = `${BASE_PATH}/wpay/card-list`
const GET_WPAY_AUTH_REQUEST = `${BASE_PATH}/wpay/auth-req`
const POST_WPAY_CARD_REMOVE = `${BASE_PATH}/wpay/card-del`
const POST_WPAY_CARD_MAIN = `${BASE_PATH}/wpay/set-main`

/*
 * WPAY 회원 가입 요청 데이터 조회
 */
export async function getWpayMemRequest() {
	return await authClient.get(GET_WPAY_MEM_REQUEST)
}

/*
 * WPAY 카드 등록 요청 데이터 조회
 */
export async function getWpayCardRequest() {
	return await authClient.get(GET_WPAY_CARD_REQUEST)
}

/**
 * WPAY 결제정보 리스트 조회
 */
export async function getWpayCardList() {
	return await authClient.get(GET_WPAY_CARD_LIST)
}

/**
 * WPAY 결제 인증 데이터 조회
 */
export async function getWpayAuthRequest({ paymentId, wpayToken, payMethod, bankCardCode, goodsName, goodsPrice }) {
	return await authClient.get(GET_WPAY_AUTH_REQUEST, {
		params: {
			paymentId,
			wpayToken,
			payMethod,
			bankCardCode,
			goodsName,
			goodsPrice,
		},
	})
}

/**
 * WPAY 카드 데이터 삭제
 */
export async function postWpayCardRemove(wpayAuthRequest) {
	return await authClient.post(POST_WPAY_CARD_REMOVE, wpayAuthRequest)
}

/**
 * WPAY 카드 대표카드 지정
 */
export async function postWpayCardMain(wpayAuthRequest) {
	return await authClient.post(POST_WPAY_CARD_MAIN, wpayAuthRequest)
}
