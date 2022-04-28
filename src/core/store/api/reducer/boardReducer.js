import { boardConstants } from '../costants/boardConstants'
import {
	boardDetailHandler,
	boardNormalListHandler,
	boardPageListHandler,
	inquiryInsertHandler,
} from '../create/boardCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function boardReducer(state, action) {
	switch (action.type) {
		case boardConstants.GET_BOARD_PAGE_LIST:
		case boardConstants.GET_BOARD_PAGE_LIST_SUCCESS:
		case boardConstants.GET_BOARD_PAGE_LIST_ERROR:
			return boardPageListHandler(state, action)
		case boardConstants.GET_BOARD_NORMAL_LIST:
		case boardConstants.GET_BOARD_NORMAL_LIST_SUCCESS:
		case boardConstants.GET_BOARD_NORMAL_LIST_ERROR:
			return boardNormalListHandler(state, action)
		case boardConstants.GET_BOARD_DETAIL:
		case boardConstants.GET_BOARD_DETAIL_SUCCESS:
		case boardConstants.GET_BOARD_DETAIL_ERROR:
			return boardDetailHandler(state, action)
		case boardConstants.POST_INQUIRY_INSERT:
		case boardConstants.POST_INQUIRY_INSERT_SUCCESS:
		case boardConstants.POST_INQUIRY_INSERT_ERROR:
			return inquiryInsertHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
