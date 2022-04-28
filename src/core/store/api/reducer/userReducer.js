import { userConstants } from '../costants/userConstants'
import {
	accessChangePasswordHandler,
	changeDefaultUserEvHandler,
	changeNewPasswordHandler,
	checkUserExistHandler,
	emailCheckHandler,
	emailSendHandler,
	niceCertRequestHandler,
	pinFlagHandler,
	userChangePasswordHandler,
	userCheckHandler,
	userEmailExistHandler,
	userFindEmailHandler,
	userInfoModifyHandler,
	userInfoRespHandler,
	userSignInHandler,
	userSignOutHandler,
	userSignSelectHandler,
	userSignUpCorpHandler,
	userSignUpHandler,
	userWpayCheckHandler,
	withdrawalHandler,
} from '../create/userCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function userReducer(state, action) {
	switch (action.type) {
		case userConstants.POST_USER_SIGN_IN:
		case userConstants.POST_USER_SIGN_IN_SUCCESS:
		case userConstants.POST_USER_SIGN_IN_ERROR:
			return userSignInHandler(state, action)
		case userConstants.POST_USER_SIGN_SELECT:
		case userConstants.POST_USER_SIGN_SELECT_SUCCESS:
		case userConstants.POST_USER_SIGN_SELECT_ERROR:
			return userSignSelectHandler(state, action)
		case userConstants.POST_USER_SIGN_UP:
		case userConstants.POST_USER_SIGN_UP_SUCCESS:
		case userConstants.POST_USER_SIGN_UP_ERROR:
			return userSignUpHandler(state, action)
		case userConstants.POST_USER_SIGN_OUT:
		case userConstants.POST_USER_SIGN_OUT_SUCCESS:
		case userConstants.POST_USER_SIGN_OUT_ERROR:
			return userSignOutHandler(state, action)
		case userConstants.POST_ACCESS_CHANGE_PASSWORD:
		case userConstants.POST_ACCESS_CHANGE_PASSWORD_SUCCESS:
		case userConstants.POST_ACCESS_CHANGE_PASSWORD_ERROR:
			return accessChangePasswordHandler(state, action)
		case userConstants.PATCH_CHANGE_NEW_PASSWORD:
		case userConstants.PATCH_CHANGE_NEW_PASSWORD_SUCCESS:
		case userConstants.PATCH_CHANGE_NEW_PASSWORD_ERROR:
			return changeNewPasswordHandler(state, action)
		case userConstants.POST_USER_SIGN_UP_CORP:
		case userConstants.POST_USER_SIGN_UP_CORP_SUCCESS:
		case userConstants.POST_USER_SIGN_UP_CORP_ERROR:
			return userSignUpCorpHandler(state, action)
		case userConstants.GET_USER_INFO_RESPONSE:
		case userConstants.GET_USER_INFO_RESPONSE_SUCCESS:
		case userConstants.GET_USER_INFO_RESPONSE_ERROR:
			return userInfoRespHandler(state, action)
		case userConstants.POST_EMAIL_EXIST:
		case userConstants.POST_EMAIL_EXIST_SUCCESS:
		case userConstants.POST_EMAIL_EXIST_ERROR:
			return userEmailExistHandler(state, action)
		case userConstants.POST_USER_CHECK:
		case userConstants.POST_USER_CHECK_SUCCESS:
		case userConstants.POST_USER_CHECK_ERROR:
			return userCheckHandler(state, action)
		case userConstants.PATCH_USER_CHANGE_PASSWORD:
		case userConstants.PATCH_USER_CHANGE_PASSWORD_SUCCESS:
		case userConstants.PATCH_USER_CHANGE_PASSWORD_ERROR:
			return userChangePasswordHandler(state, action)
		case userConstants.GET_USER_EMAIL_RESPONSE:
		case userConstants.GET_USER_EMAIL_RESPONSE_SUCCESS:
		case userConstants.GET_USER_EMAIL_RESPONSE_ERROR:
			return userFindEmailHandler(state, action)
		case userConstants.PUT_USER_INFO_MODIFY:
		case userConstants.PUT_USER_INFO_MODIFY_SUCCESS:
		case userConstants.PUT_USER_INFO_MODIFY_ERROR:
			return userInfoModifyHandler(state, action)
		case userConstants.POST_EMAIL_SEND:
		case userConstants.POST_EMAIL_SEND_SUCCESS:
		case userConstants.POST_EMAIL_SEND_ERROR:
			return emailSendHandler(state, action)
		case userConstants.POST_EMAIL_CHECK:
		case userConstants.POST_EMAIL_CHECK_SUCCESS:
		case userConstants.POST_EMAIL_CHECK_ERROR:
			return emailCheckHandler(state, action)
		case userConstants.GET_NICE_CERT_REQUEST:
		case userConstants.GET_NICE_CERT_REQUEST_SUCCESS:
		case userConstants.GET_NICE_CERT_REQUEST_ERROR:
			return niceCertRequestHandler(state, action)
		case userConstants.PATCH_CHANGE_DEFAULT_USER_EV:
		case userConstants.PATCH_CHANGE_DEFAULT_USER_EV_SUCCESS:
		case userConstants.PATCH_CHANGE_DEFAULT_USER_EV_ERROR:
			return changeDefaultUserEvHandler(state, action)
		case userConstants.PATCH_WITHDRAWAL:
		case userConstants.PATCH_WITHDRAWAL_SUCCESS:
		case userConstants.PATCH_WITHDRAWAL_ERROR:
			return withdrawalHandler(state, action)
		case userConstants.GET_USER_WPAY_CHECK:
		case userConstants.GET_USER_WPAY_CHECK_SUCCESS:
		case userConstants.GET_USER_WPAY_CHECK_ERROR:
			return userWpayCheckHandler(state, action)
		case userConstants.PATCH_PIN_FLAG:
		case userConstants.PATCH_PIN_FLAG_SUCCESS:
		case userConstants.PATCH_PIN_FLAG_ERROR:
			return pinFlagHandler(state, action)
		case userConstants.POST_CHECK_USER_EXIST:
		case userConstants.POST_CHECK_USER_EXIST_SUCCESS:
		case userConstants.POST_CHECK_USER_EXIST_ERROR:
			return checkUserExistHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
