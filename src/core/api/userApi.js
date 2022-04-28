import { authClient, noneAuthClient } from '../config/axios'

const BASE_PATH = '/user'
const SIGN_IN = `${BASE_PATH}/sign/in`
const SIGN_SELECT = `${BASE_PATH}/sign/select`
const SIGN_UP = `${BASE_PATH}/sign/up/person`
const SIGN_OUT = `${BASE_PATH}/sign/out`
const SILENT_REFRESH = `${BASE_PATH}/silent-refresh`
const EXPIRE_TIME = `${BASE_PATH}/expire-time`
const ACCESS_CHANGE_PASSWORD = `${BASE_PATH}/access/change-password`
const CHANGE_NEW_PASSWORD = `${BASE_PATH}/change/new-password`
const SIGN_UP_CORP = `${BASE_PATH}/sign/up/corp`
const NICE_CERT_REQUEST = `${BASE_PATH}/nice-cert/request`
const NICE_CERT_RESPONSE = `${BASE_PATH}/nice-cert/response`
const USER_INFO_RESPONSE = `${BASE_PATH}/user-information`
const USER_EMAIL_EXIST = `${BASE_PATH}/find-passwd/email`
const USER_CHECK_INFO = `${BASE_PATH}/find-passwd/check`
const USER_CHANGE_PASSWORD = `${BASE_PATH}/find-passwd/passwd`
const GET_USER_EMAIL_RESPONSE = `${BASE_PATH}/find-email/email`
const USER_INFO_MODIFY = `${BASE_PATH}/modify/user-info`
const EMAIL_SEND = `${BASE_PATH}/email/send`
const EMAIL_CHECK = `${BASE_PATH}/email/auth-check`
const WITHDRAWAL = `${BASE_PATH}/withdrawal`
const PINFLAG = `${BASE_PATH}/pinflag`
const USER_EXIST_CHECK = `${BASE_PATH}/exist`

/*
 * 로그인
 * param: email, passwd
 * return: { "id": int, "accessToken": string, "name": string, "email": string, "userTypeCd": string }
 */
export async function postUserSignIn(signInRequest) {
	return await noneAuthClient.post(SIGN_IN, signInRequest)
}

/*
 * 회원 선택 후 재로그인
 * param: id, accessTokenList, refreshTokenList
 * return: { "id": int, "accessToken": string, "name": string, "email": string, "userTypeCd": string }
 */
export async function postUserSignSelect(signSelectRequest) {
	return await authClient.post(SIGN_SELECT, signSelectRequest)
}

/*
 * 회원가입
 * return: true, false
 */
export async function postUserSignUp(signUpRequest) {
	return await noneAuthClient.post(SIGN_UP, signUpRequest)
}
/*
 *법인 회원가입
 *return: true, false
 */
export async function postUserSignUpCorp(signUpCorpRequest) {
	return await noneAuthClient.post(SIGN_UP_CORP, signUpCorpRequest)
}

/*
 * 로그아웃
 * return: boolean
 */
export async function postUserSignOut(signOutRequest) {
	return await authClient.post(SIGN_OUT, signOutRequest)
}

/*
 *비밀번호 인증
 * return: true, false
 */
export async function postAccessChangePassword(passwdRequest) {
	return await authClient.post(ACCESS_CHANGE_PASSWORD, passwdRequest)
}

/*
 *새로운 비밀번호 입력
 * return: true, false
 */
export async function patchChangeNewPassword(passwdRequest) {
	return await authClient.patch(CHANGE_NEW_PASSWORD, passwdRequest)
}

export async function postUserResetPassword(resetPasswordRequest) {
	return await authClient.post('/user/reset/password', resetPasswordRequest)
}

export async function postSilentRefresh(silentRequest) {
	return await noneAuthClient.post(SILENT_REFRESH, silentRequest)
}

export async function getExpireTime() {
	return await authClient.get(EXPIRE_TIME)
}

export async function getNiceCertRequest({ params }) {
	return await noneAuthClient.get(NICE_CERT_REQUEST, {
		params: {
			params: JSON.stringify(params),
		},
	})
}

export async function getNiceCertResponse({ tokenVersionId, encData, integrityValue, iv, key }) {
	return await noneAuthClient.post(NICE_CERT_RESPONSE, { tokenVersionId, encData, integrityValue, iv, key })
}

/** 회원정보 조회
 *
 */
export async function getUserInfoResponse() {
	return await authClient.get(USER_INFO_RESPONSE)
}

/* 회원 이메일 유무
 * return : 1
 */
export async function postUserEmailExist(emailRequest) {
	return await noneAuthClient.post(USER_EMAIL_EXIST, emailRequest)
}

/* 회원 이메일 과 정보일치
 * return : true, false
 */

export async function postUserCheck(findRequest) {
	return await noneAuthClient.post(USER_CHECK_INFO, findRequest)
}

/* 회원 비밀번호 찾기: 비밀번호 변경
 * return : true, false
 */
export async function patchUserChangePassword(newPasswdRequest) {
	return await noneAuthClient.patch(USER_CHANGE_PASSWORD, newPasswdRequest)
}
/*회원 이메일 찾기
 *
 */
export async function getUserEmail({ hp, name, birthdateStr }) {
	return await noneAuthClient.get(GET_USER_EMAIL_RESPONSE, {
		params: {
			hp,
			name,
			birthdateStr,
		},
	})
}

//회원 정보 수정
export async function putUserInfoModify(emailRequest) {
	return await authClient.put(USER_INFO_MODIFY, emailRequest)
}

//이메일 전송
export async function postEmailSend(emailRequest) {
	return await noneAuthClient.post(EMAIL_SEND, emailRequest)
}

//이메일 체크
export async function postEmailCheck(emailVerifyRequest) {
	return await noneAuthClient.post(EMAIL_CHECK, emailVerifyRequest)
}

/**
 * 회원 default 차량 변경
 * @param {*} defaultUserEvId
 * @returns
 */
export async function patchChangeDefaultUserEv({ defaultUserEvId }) {
	return await authClient.patch(`${BASE_PATH}/change/user_ev/${defaultUserEvId}`)
}

/**
 * 회원 탈퇴
 * @returns
 */
export async function patchWithdrawal() {
	return await authClient.patch(WITHDRAWAL)
}

/**
 * 이니시스 wpay 가입 여부 확인
 */
export async function getUserWpayCheck() {
	return await authClient.get(`${BASE_PATH}/wpay-check`)
}

/**
 * 비밀번호 생략 토글 업데이트
 */
export async function patchPinFlag(userPinFlagRequest) {
	return await noneAuthClient.patch(PINFLAG, userPinFlagRequest)
}
/**
 * 회원 유무 확인
 */
export async function postCheckUserExist(signUpRequest) {
	return await noneAuthClient.post(USER_EXIST_CHECK, signUpRequest)
}
