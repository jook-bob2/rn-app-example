import { inicisConstants } from '../costants/inicisConstants'
import {
	wpayAuthRequestHandler,
	wpayCardListHandler,
	wpayCardMainHandler,
	wpayCardRemoveHandler,
	wpayCardRequestHandler,
	wpayMemRequestHandler,
} from '../create/inicisCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function inicisReducer(state, action) {
	switch (action.type) {
		case inicisConstants.GET_WPAY_MEM_REQUEST:
		case inicisConstants.GET_WPAY_MEM_REQUEST_SUCCESS:
		case inicisConstants.GET_WPAY_MEM_REQUEST_ERROR:
			return wpayMemRequestHandler(state, action)
		case inicisConstants.GET_WPAY_CARD_REQUEST:
		case inicisConstants.GET_WPAY_CARD_REQUEST_SUCCESS:
		case inicisConstants.GET_WPAY_CARD_REQUEST_ERROR:
			return wpayCardRequestHandler(state, action)
		case inicisConstants.GET_WPAY_CARD_LIST:
		case inicisConstants.GET_WPAY_CARD_LIST_SUCCESS:
		case inicisConstants.GET_WPAY_CARD_LIST_ERROR:
			return wpayCardListHandler(state, action)
		case inicisConstants.GET_WPAY_AUTH_REQUEST:
		case inicisConstants.GET_WPAY_AUTH_REQUEST_SUCCESS:
		case inicisConstants.GET_WPAY_AUTH_REQUEST_ERROR:
			return wpayAuthRequestHandler(state, action)
		case inicisConstants.POST_WPAY_CARD_REMOVE:
		case inicisConstants.POST_WPAY_CARD_REMOVE_SUCCESS:
		case inicisConstants.POST_WPAY_CARD_REMOVE_ERROR:
			return wpayCardRemoveHandler(state, action)
		case inicisConstants.POST_WPAY_CARD_MAIN:
		case inicisConstants.POST_WPAY_CARD_MAIN_SUCCESS:
		case inicisConstants.POST_WPAY_CARD_MAIN_ERROR:
			return wpayCardMainHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
