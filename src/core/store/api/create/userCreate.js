import {
	getNiceCertRequest,
	getUserEmail,
	getUserInfoResponse,
	getUserWpayCheck,
	patchChangeDefaultUserEv,
	patchChangeNewPassword,
	patchPinFlag,
	patchUserChangePassword,
	patchWithdrawal,
	postAccessChangePassword,
	postCheckUserExist,
	postEmailCheck,
	postEmailSend,
	postUserCheck,
	postUserEmailExist,
	postUserSignIn,
	postUserSignOut,
	postUserSignSelect,
	postUserSignUp,
	postUserSignUpCorp,
	putUserInfoModify,
} from '@api/userApi'
import { createContext } from 'react'
import { userConstants } from '../costants/userConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const UserContext = createContext(null)

// 핸들러를 생성함.
export const userSignInHandler = createAsyncHandler(userConstants.POST_USER_SIGN_IN, 'userSignIn')
export const userSignSelectHandler = createAsyncHandler(userConstants.POST_USER_SIGN_SELECT, 'userSignSelect')
export const userSignUpHandler = createAsyncHandler(userConstants.POST_USER_SIGN_UP, 'userSignUp')
export const userSignOutHandler = createAsyncHandler(userConstants.POST_USER_SIGN_OUT, 'userSignOut')
export const accessChangePasswordHandler = createAsyncHandler(
	userConstants.POST_ACCESS_CHANGE_PASSWORD,
	'accessChangePassword',
)
export const changeNewPasswordHandler = createAsyncHandler(userConstants.PATCH_CHANGE_NEW_PASSWORD, 'changeNewPassword')
export const userSignUpCorpHandler = createAsyncHandler(userConstants.POST_USER_SIGN_UP_CORP, 'userSignUpCorp')
export const userInfoRespHandler = createAsyncHandler(userConstants.GET_USER_INFO_RESPONSE, 'userInfoResponse')
export const userEmailExistHandler = createAsyncHandler(userConstants.POST_EMAIL_EXIST, 'userEmailExist')
export const userCheckHandler = createAsyncHandler(userConstants.POST_USER_CHECK, 'userCheck')
export const userChangePasswordHandler = createAsyncHandler(
	userConstants.PATCH_USER_CHANGE_PASSWORD,
	'userChangePassword',
)
export const userFindEmailHandler = createAsyncHandler(userConstants.GET_USER_EMAIL_RESPONSE, 'userFindEmail')
export const userInfoModifyHandler = createAsyncHandler(userConstants.PUT_USER_INFO_MODIFY, 'userInfoModify')
export const emailSendHandler = createAsyncHandler(userConstants.POST_EMAIL_SEND, 'emailSend')
export const emailCheckHandler = createAsyncHandler(userConstants.POST_EMAIL_CHECK, 'emailCheck')
export const niceCertRequestHandler = createAsyncHandler(userConstants.GET_NICE_CERT_REQUEST, 'niceCertRequest')
export const changeDefaultUserEvHandler = createAsyncHandler(
	userConstants.PATCH_CHANGE_DEFAULT_USER_EV,
	'changeDefaultUserEv',
)
export const withdrawalHandler = createAsyncHandler(userConstants.PATCH_WITHDRAWAL, 'withdrawal')
export const userWpayCheckHandler = createAsyncHandler(userConstants.GET_USER_WPAY_CHECK, 'userWpayCheck')
export const pinFlagHandler = createAsyncHandler(userConstants.PATCH_PIN_FLAG, 'pinFlag')
export const checkUserExistHandler = createAsyncHandler(userConstants.POST_CHECK_USER_EXIST, 'checkUserExist')

// 액션을 핸들링하고, API 호출함.
export const POST_USER_SIGN_IN = createAsyncDispatcher(userConstants.POST_USER_SIGN_IN, postUserSignIn)
export const POST_USER_SIGN_SELECT = createAsyncDispatcher(userConstants.POST_USER_SIGN_SELECT, postUserSignSelect)
export const POST_USER_SIGN_UP = createAsyncDispatcher(userConstants.POST_USER_SIGN_UP, postUserSignUp)
export const POST_USER_SIGN_OUT = createAsyncDispatcher(userConstants.POST_USER_SIGN_OUT, postUserSignOut)
export const POST_ACCESS_CHANGE_PASSWORD = createAsyncDispatcher(
	userConstants.POST_ACCESS_CHANGE_PASSWORD,
	postAccessChangePassword,
)
export const PATCH_CHANGE_NEW_PASSWORD = createAsyncDispatcher(
	userConstants.PATCH_CHANGE_NEW_PASSWORD,
	patchChangeNewPassword,
)
export const POST_USER_SIGN_UP_CORP = createAsyncDispatcher(userConstants.POST_USER_SIGN_UP_CORP, postUserSignUpCorp)
export const GET_USER_INFO_RESPONSE = createAsyncDispatcher(userConstants.GET_USER_INFO_RESPONSE, getUserInfoResponse)
export const POST_EMAIL_EXIST = createAsyncDispatcher(userConstants.POST_EMAIL_EXIST, postUserEmailExist)
export const POST_USER_CHECK = createAsyncDispatcher(userConstants.POST_USER_CHECK, postUserCheck)
export const PATCH_USER_CHANGE_PASSWORD = createAsyncDispatcher(
	userConstants.PATCH_USER_CHANGE_PASSWORD,
	patchUserChangePassword,
)
export const GET_FIND_EMAIL = createAsyncDispatcher(userConstants.GET_USER_EMAIL_RESPONSE, getUserEmail)
export const PUT_USER_INFO_MODIFY = createAsyncDispatcher(userConstants.PUT_USER_INFO_MODIFY, putUserInfoModify)
export const POST_EMAIL_SEND = createAsyncDispatcher(userConstants.POST_EMAIL_SEND, postEmailSend)
export const POST_EMAIL_CHECK = createAsyncDispatcher(userConstants.POST_EMAIL_CHECK, postEmailCheck)
export const GET_NICE_CERT_REQUEST = createAsyncDispatcher(userConstants.GET_NICE_CERT_REQUEST, getNiceCertRequest)
export const PATCH_CHANGE_DEFAULT_USER_EV = createAsyncDispatcher(
	userConstants.PATCH_CHANGE_DEFAULT_USER_EV,
	patchChangeDefaultUserEv,
)
export const PATCH_WITHDRAWAL = createAsyncDispatcher(userConstants.PATCH_WITHDRAWAL, patchWithdrawal)
export const GET_USER_WPAY_CHECK = createAsyncDispatcher(userConstants.GET_USER_WPAY_CHECK, getUserWpayCheck)
export const PATCH_PIN_FLAG = createAsyncDispatcher(userConstants.PATCH_PIN_FLAG, patchPinFlag)
export const POST_CHECK_USER_EXIST = createAsyncDispatcher(userConstants.POST_CHECK_USER_EXIST, postCheckUserExist)
