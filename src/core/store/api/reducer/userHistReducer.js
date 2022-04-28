import { userHistConstants } from '../costants/userHistConstants'
import { signInHistHandler } from '../create/userHistCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function userHistReducer(state, action) {
	switch (action.type) {
		case userHistConstants.POST_SIGN_IN_HIST:
		case userHistConstants.POST_SIGN_IN_HIST_SUCCESS:
		case userHistConstants.POST_SIGN_IN_HIST_ERROR:
			return signInHistHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
