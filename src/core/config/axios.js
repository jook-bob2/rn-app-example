import axios from 'axios'
import { API_URL } from '../../../env.json'
import { storageUtil } from '@util/storageUtil'
import userConst from '@/constants/userConst'
import { validAccessToken } from './validToken'
import { postSilentRefresh } from '../api/userApi'
import storageConst from '@/constants/storageConst'

const { AUTHORIZATION, UNKNOWN_ERROR, BAD_REQUEST, UNAUTHORIZED_CODE } = userConst
const { USER_INFO } = storageConst

// let isTokenRefreshing = false

/*
 * axios 인터셉터 설정
 */
function setInterceptors(instance) {
	instance.interceptors.request.use(
		(config) => {
			if (config.authentication) {
				storageUtil
					.getItem({ key: USER_INFO })
					.then((result) => {
						const { accessToken } = result.data
						if (validAccessToken(accessToken)) config.headers[AUTHORIZATION] = accessToken
					})
					.catch((err) => {
						console.log('user info error => ', err)
					})
			}

			return config
		},
		(error) => {
			return Promise.reject(error)
		},
	)
	instance.interceptors.response.use(
		(response) => {
			return response.data
		},
		async (error) => {
			const { response, config } = error
			const originalRequest = config

			if (response) {
				// 서버 오류일 경우
				// 아래와 같은 데이터가 반환 된다.
				// config: {url: "/user/login", method: "post", data: "{\"email\":\"sha256@naver.com\",\"passwd\":\"asdf1414!\"}", headers: {…}, baseURL: "http://localhost:8080", …}
				// data: {success: false, code: "ESVC005", msg: "토큰 정보가 없거나 유효하지 않습니다."}
				// headers: {content-type: "application/json"}
				// request: XMLHttpRequest {readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, onreadystatechange: ƒ, …}
				// status: 401
				// statusText: ""
				if (response.data) {
					const { code, msg, status, error: e } = response.data
					if (code && msg) {
						// console.log('isTokenRefreshing =>', isTokenRefreshing)
						if (code === UNAUTHORIZED_CODE) {
							// if (!isTokenRefreshing) {
							return getRefreshData(originalRequest)
							// }
						}
						return Promise.reject({ success: false, code, msg })
					}
					if (status && e && status === 404) {
						return Promise.reject({ success: false, code: status, msg: error })
					}
				} else if (response.status === 400) {
					return Promise.reject({ success: false, code: response.status, msg: BAD_REQUEST })
				} else if (response.status === 401) {
					return getRefreshData(originalRequest)
				}
			}

			// 알 수 없는 오류일 경우
			return Promise.reject({ success: false, code: 40999, msg: UNKNOWN_ERROR })
		},
	)
	return instance
}

// 권한 axios
function authCreate(url, options) {
	const instance = axios.create(Object.assign({ baseURL: url }, options))
	setInterceptors(instance)
	return instance
}

// 비권한 axios
function noneAuthCreate(url, options) {
	const instance = axios.create(Object.assign({ baseURL: url }, options))
	setInterceptors(instance)
	return instance
}

export function setAxiosHeader({ key, value }) {
	authClient.defaults.headers[key] = value
}

// 토큰 갱신 진행
async function getRefreshData(originalRequest) {
	try {
		// isTokenRefreshing = true
		const currentUser = await storageUtil.getItem({ key: USER_INFO })
		const currentUserData = currentUser?.data

		if (currentUserData?.id && currentUserData?.refreshToken) {
			try {
				const refreshUser = await postSilentRefresh({
					id: currentUserData.id,
					refreshToken: currentUserData.refreshToken,
				})
				console.info('========== CONFIG = 권한이 만료 되어 재요청 진행 ==========')
				const data = refreshUser.data
				const { accessToken } = data
				setAxiosHeader({ key: AUTHORIZATION, value: accessToken })
				const refreshData = await storageUtil.setItem({ key: USER_INFO, value: data, options: { addYear: 1 } })
				if (Object.values(refreshData).length > 0) {
					originalRequest.headers[AUTHORIZATION] = accessToken
					return authClient(originalRequest)
				}
			} catch (e2) {
				console.log('e2 => ', e2)
			}
		} else {
			return false
		}
	} catch (e1) {
		console.log('e1 => ', e1)
	}
}

// 토큰 검증 할 때 사용
export const authClient = authCreate(API_URL, { authentication: true })

// 토큰 검증 안 할 때 사용
export const noneAuthClient = noneAuthCreate(API_URL, { authentication: false })
