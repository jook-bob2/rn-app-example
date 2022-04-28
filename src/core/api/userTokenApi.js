import { authClient } from '../config/axios'

const BASE_PATH = '/user-token'
const USER_TOKEN_SAVE = `${BASE_PATH}/save`

/*
 * 유저 토큰 저장
 * param: token, userId, instanceId
 * return: boolean
 */
export async function postSaveUserToken(saveTokenRequest) {
	return await authClient.post(USER_TOKEN_SAVE, saveTokenRequest)
}
