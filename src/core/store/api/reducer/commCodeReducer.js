import { commCodeConstants } from '../costants/commCodeConstants'
import { commCodeSearchListHandler } from '../create/commCodeCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function commCodeReducer(state, action) {
	switch (action.type) {
		case commCodeConstants.GET_COMM_CODE_SEARCH_LIST:
		case commCodeConstants.GET_COMM_CODE_SEARCH_LIST_SUCCESS:
		case commCodeConstants.GET_COMM_CODE_SEARCH_LIST_ERROR:
			return commCodeSearchListHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
