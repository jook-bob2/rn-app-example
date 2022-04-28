import { promotionConstants } from '../costants/promotionConstants'
import { promotionListHandler } from '../create/promotionCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function promotionReducer(state, action) {
	switch (action.type) {
		case promotionConstants.GET_PROMOTION_LIST_PAGE:
		case promotionConstants.GET_PROMOTION_LIST_PAGE_SUCCESS:
		case promotionConstants.GET_PROMOTION_LIST_PAGE_ERROR:
			return promotionListHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
