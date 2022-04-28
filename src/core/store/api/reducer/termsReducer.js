import { termsConstants } from '../costants/termsConstants'
import { corpTermsListHandler, personalTermsListHandler, termsListHandler } from '../create/termsCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function termsReducer(state, action) {
	switch (action.type) {
		case termsConstants.GET_TERMS_LIST:
		case termsConstants.GET_TERMS_LIST_SUCCESS:
		case termsConstants.GET_TERMS_LIST_ERROR:
			return termsListHandler(state, action)
		case termsConstants.GET_PERSONAL_TERMS_LIST:
		case termsConstants.GET_PERSONAL_TERMS_LIST_SUCCESS:
		case termsConstants.GET_PERSONAL_TERMS_LIST_ERROR:
			return personalTermsListHandler(state, action)
		case termsConstants.GET_CORP_TERMS_LIST:
		case termsConstants.GET_CORP_TERMS_LIST_SUCCESS:
		case termsConstants.GET_CORP_TERMS_LIST_ERROR:
			return corpTermsListHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
