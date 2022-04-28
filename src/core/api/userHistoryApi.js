import { noneAuthClient } from '../config/axios'

const BASE_PATH = '/user-hist'
const POST_SIGN_IN_HIST = `${BASE_PATH}/sign/in`

/*
 * 로그인 이력 저장
 * param: latitude, longitude, userId, remoteAddr, userAgent
 * return: boolean
 */
export async function postSignInHist(signInHistRequest) {
	return await noneAuthClient.post(POST_SIGN_IN_HIST, signInHistRequest)
}
