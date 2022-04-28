import { userEvConstants } from '../costants/userEvConstants'
import {
	myEvListHandler,
	sharedEvListHandler,
	addEvHandler,
	approveShareHandler,
	checkShareHandler,
	newUserEvListHandler,
	receivedShareListHandler,
	refuseShareHandler,
	sendShareHandler,
	sharedUserEvListHandler,
	sharedUserListHandler,
	stopShareHandler,
	releaseShareHandler,
	userEvDeleteHandler,
	userEvInfoHandler,
	userEvListHandler,
	userEvModifyHandler,
	userMyEvListHandler,
} from '../create/userEvCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function userEvReducer(state, action) {
	switch (action.type) {
		case userEvConstants.GET_USER_EV_LIST:
		case userEvConstants.GET_USER_EV_LIST_SUCCESS:
		case userEvConstants.GET_USER_EV_LIST_ERROR:
			return userEvListHandler(state, action)
		case userEvConstants.GET_MY_EV_LIST:
		case userEvConstants.GET_MY_EV_LIST_SUCCESS:
		case userEvConstants.GET_MY_EV_LIST_ERROR:
			return myEvListHandler(state, action)
		case userEvConstants.GET_SHARED_EV_LIST:
		case userEvConstants.GET_SHARED_EV_LIST_SUCCESS:
		case userEvConstants.GET_SHARED_EV_LIST_ERROR:
			return sharedEvListHandler(state, action)

		case userEvConstants.GET_SHARED_USER_EV_LIST:
		case userEvConstants.GET_SHARED_USER_EV_LIST_SUCCESS:
		case userEvConstants.GET_SHARED_USER_EV_LIST_ERROR:
			return sharedUserEvListHandler(state, action)

		case userEvConstants.GET_SHARED_USER_LIST:
		case userEvConstants.GET_SHARED_USER_LIST_SUCCESS:
		case userEvConstants.GET_SHARED_USER_LIST_ERROR:
			return sharedUserListHandler(state, action)
		case userEvConstants.GET_RECEIVED_SHARE_LIST:
		case userEvConstants.GET_RECEIVED_SHARE_LIST_SUCCESS:
		case userEvConstants.GET_RECEIVED_SHARE_LIST_ERROR:
			return receivedShareListHandler(state, action)
		case userEvConstants.POST_SEND_SHARE:
		case userEvConstants.POST_SEND_SHARE_SUCCESS:
		case userEvConstants.POST_SEND_SHARE_ERROR:
			return sendShareHandler(state, action)
		case userEvConstants.PATCH_REFUSE_SHARE:
		case userEvConstants.PATCH_REFUSE_SHARE_SUCCESS:
		case userEvConstants.PATCH_REFUSE_SHARE_ERROR:
			return refuseShareHandler(state, action)
		case userEvConstants.GET_CHECK_SHARE:
		case userEvConstants.GET_CHECK_SHARE_SUCCESS:
		case userEvConstants.GET_CHECK_SHARE_ERROR:
			return checkShareHandler(state, action)
		case userEvConstants.POST_APPROVE_SHARE:
		case userEvConstants.POST_APPROVE_SHARE_SUCCESS:
		case userEvConstants.POST_APPROVE_SHARE_ERROR:
			return approveShareHandler(state, action)
		case userEvConstants.POST_ADD_EV:
		case userEvConstants.POST_ADD_EV_SUCCESS:
		case userEvConstants.POST_ADD_EV_ERROR:
			return addEvHandler(state, action)
		case userEvConstants.GET_NEW_USER_EV_LIST:
		case userEvConstants.GET_NEW_USER_EV_LIST_SUCCESS:
		case userEvConstants.GET_NEW_USER_EV_LIST_ERROR:
			return newUserEvListHandler(state, action)
		case userEvConstants.GET_USER_EV_INFO:
		case userEvConstants.GET_USER_EV_INFO_SUCCESS:
		case userEvConstants.GET_USER_EV_INFO_ERROR:
			return userEvInfoHandler(state, action)
		case userEvConstants.PATCH_USER_EV:
		case userEvConstants.PATCH_USER_EV_SUCCESS:
		case userEvConstants.PATCH_USER_EV_ERROR:
			return userEvModifyHandler(state, action)
		case userEvConstants.PATCH_STOP_SHARE:
		case userEvConstants.PATCH_STOP_SHARE_SUCCESS:
		case userEvConstants.PATCH_STOP_SHARE_ERROR:
			return stopShareHandler(state, action)
		case userEvConstants.PATCH_RELEASE_SHARE:
		case userEvConstants.PATCH_RELEASE_SHARE_SUCCESS:
		case userEvConstants.PATCH_RELEASE_SHARE_ERROR:
			return releaseShareHandler(state, action)
		case userEvConstants.DELETE_USER_EV:
		case userEvConstants.DELETE_USER_EV_SUCCESS:
		case userEvConstants.DELETE_USER_EV_ERROR:
			return userEvDeleteHandler(state, action)
		case userEvConstants.GET_USER_MY_EV_LIST:
		case userEvConstants.GET_USER_MY_EV_LIST_SUCCESS:
		case userEvConstants.GET_USER_MY_EV_LIST_ERROR:
			return userMyEvListHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
