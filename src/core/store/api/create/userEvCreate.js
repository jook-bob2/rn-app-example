import {
	getMyEvList,
	getSharedEvList,
	deleteUserEv,
	getCheckSharePassword,
	getNewUserEvList,
	getReceivedShareList,
	getSharedUserEvList,
	getSharedUserList,
	getUserEvInfo,
	getUserEvList,
	getUserMyEvList,
	patchRefuseShare,
	patchStopShare,
	patchReleaseShare,
	patchUserEvInfo,
	postAddEv,
	postApproveShare,
	postSendShare,
} from '@api/userEvApi'
import { createContext } from 'react'
import { userEvConstants } from '../costants/userEvConstants'
import { createAsyncDispatcher } from '../utils/createAsyncDispatcher'
import { createAsyncHandler } from '../utils/createAsyncHandler'

// 컨텍스트를 생성함
export const UserEvContext = createContext(null)

// 핸들러를 생성함.
export const userEvListHandler = createAsyncHandler(userEvConstants.GET_USER_EV_LIST, 'userEvList')
export const myEvListHandler = createAsyncHandler(userEvConstants.GET_MY_EV_LIST, 'myEvList')
export const sharedEvListHandler = createAsyncHandler(userEvConstants.GET_SHARED_EV_LIST, 'sharedEvList')

export const sharedUserEvListHandler = createAsyncHandler(userEvConstants.GET_SHARED_USER_EV_LIST, 'sharedUserEvList')

export const sharedUserListHandler = createAsyncHandler(userEvConstants.GET_SHARED_USER_LIST, 'sharedUserList')
export const receivedShareListHandler = createAsyncHandler(userEvConstants.GET_RECEIVED_SHARE_LIST, 'receivedShareList')
export const sendShareHandler = createAsyncHandler(userEvConstants.POST_SEND_SHARE, 'sendShare')
export const refuseShareHandler = createAsyncHandler(userEvConstants.PATCH_REFUSE_SHARE, 'refuseShare')
export const checkShareHandler = createAsyncHandler(userEvConstants.GET_CHECK_SHARE, 'checkShare')
export const approveShareHandler = createAsyncHandler(userEvConstants.POST_APPROVE_SHARE, 'approveShare')
export const addEvHandler = createAsyncHandler(userEvConstants.POST_ADD_EV, 'addEv')
export const newUserEvListHandler = createAsyncHandler(userEvConstants.GET_NEW_USER_EV_LIST, 'newUserEvList')
export const userEvInfoHandler = createAsyncHandler(userEvConstants.GET_USER_EV_INFO, 'userEvInfo')
export const userEvModifyHandler = createAsyncHandler(userEvConstants.PATCH_USER_EV, 'userEvModify')
export const stopShareHandler = createAsyncHandler(userEvConstants.PATCH_STOP_SHARE, 'stopShare')
export const releaseShareHandler = createAsyncHandler(userEvConstants.PATCH_RELEASE_SHARE, 'releaseShare')
export const userEvDeleteHandler = createAsyncHandler(userEvConstants.DELETE_USER_EV, 'userEvDelete')
export const userMyEvListHandler = createAsyncHandler(userEvConstants.GET_USER_MY_EV_LIST, 'userMyEvList')

// 액션을 핸들링하고, API 호출함.
export const GET_USER_EV_LIST = createAsyncDispatcher(userEvConstants.GET_USER_EV_LIST, getUserEvList)
export const GET_MY_EV_LIST = createAsyncDispatcher(userEvConstants.GET_MY_EV_LIST, getMyEvList)
export const GET_SHARED_EV_LIST = createAsyncDispatcher(userEvConstants.GET_SHARED_EV_LIST, getSharedEvList)

export const GET_SHARED_USER_EV_LIST = createAsyncDispatcher(
	userEvConstants.GET_SHARED_USER_EV_LIST,
	getSharedUserEvList,
)
export const GET_SHARED_USER_LIST = createAsyncDispatcher(userEvConstants.GET_SHARED_USER_LIST, getSharedUserList)
export const GET_RECEIVED_SHARE_LIST = createAsyncDispatcher(
	userEvConstants.GET_RECEIVED_SHARE_LIST,
	getReceivedShareList,
)
export const POST_SEND_SHARE = createAsyncDispatcher(userEvConstants.POST_SEND_SHARE, postSendShare)
export const PATCH_REFUSE_SHARE = createAsyncDispatcher(userEvConstants.PATCH_REFUSE_SHARE, patchRefuseShare)
export const GET_CHECK_SHARE = createAsyncDispatcher(userEvConstants.GET_CHECK_SHARE, getCheckSharePassword)
export const POST_APPROVE_SHARE = createAsyncDispatcher(userEvConstants.POST_APPROVE_SHARE, postApproveShare)
export const POST_ADD_EV = createAsyncDispatcher(userEvConstants.POST_ADD_EV, postAddEv)
export const GET_NEW_USER_EV_LIST = createAsyncDispatcher(userEvConstants.GET_NEW_USER_EV_LIST, getNewUserEvList)
export const GET_USER_EV_INFO = createAsyncDispatcher(userEvConstants.GET_USER_EV_INFO, getUserEvInfo)
export const PATCH_USER_EV = createAsyncDispatcher(userEvConstants.PATCH_USER_EV, patchUserEvInfo)
export const PATCH_STOP_SHARE = createAsyncDispatcher(userEvConstants.PATCH_STOP_SHARE, patchStopShare)
export const PATCH_RELEASE_SHARE = createAsyncDispatcher(userEvConstants.PATCH_RELEASE_SHARE, patchReleaseShare)
export const DELETE_USER_EV = createAsyncDispatcher(userEvConstants.DELETE_USER_EV, deleteUserEv)
export const GET_USER_MY_EV_LIST = createAsyncDispatcher(userEvConstants.GET_USER_MY_EV_LIST, getUserMyEvList)
