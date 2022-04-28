import { messageConstants } from '../costants/messageConstants'
import { messageDetailHandler, messageListHandler, readValueHandler, unreadCountHandler } from '../create/messageCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function messageReducer(state, action) {
	switch (action.type) {
		case messageConstants.GET_MESSAGE_LIST:
		case messageConstants.GET_MESSAGE_LIST_SUCCESS:
		case messageConstants.GET_MESSAGE_LIST_ERROR:
			return messageListHandler(state, action)
		case messageConstants.PATCH_READ_VALUE:
		case messageConstants.PATCH_READ_VALUE_SUCCESS:
		case messageConstants.PATCH_READ_VALUE_ERROR:
			return readValueHandler(state, action)
		case messageConstants.GET_UNREAD_COUNT:
		case messageConstants.GET_UNREAD_COUNT_SUCCESS:
		case messageConstants.GET_UNREAD_COUNT_ERROR:
			return unreadCountHandler(state, action)
		case messageConstants.GET_MESSAGE_DETAIL:
		case messageConstants.GET_MESSAGE_DETAIL_SUCCESS:
		case messageConstants.GET_MESSAGE_DETAIL_ERROR:
			return messageDetailHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
