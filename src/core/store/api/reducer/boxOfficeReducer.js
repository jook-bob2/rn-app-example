import { boxOfficeConstants } from '../costants/boxOfficeConstants'
import { boxOfficeDetailHandler, boxOfficeListHandler, boxOfficePeopleHandler } from '../create/boxOfficeCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function boxOfficeReducer(state, action) {
	switch (action.type) {
		case boxOfficeConstants.GET_BOX_OFFICE_LIST:
		case boxOfficeConstants.GET_BOX_OFFICE_LIST_SUCCESS:
		case boxOfficeConstants.GET_BOX_OFFICE_LIST_ERROR:
			return boxOfficeListHandler(state, action)
		case boxOfficeConstants.GET_BOX_OFFICE_DETAIL:
		case boxOfficeConstants.GET_BOX_OFFICE_DETAIL_SUCCESS:
		case boxOfficeConstants.GET_BOX_OFFICE_DETAIL_ERROR:
			return boxOfficeDetailHandler(state, action)
		case boxOfficeConstants.GET_BOX_OFFICE_PEOPLE:
		case boxOfficeConstants.GET_BOX_OFFICE_PEOPLE_SUCCESS:
		case boxOfficeConstants.GET_BOX_OFFICE_PEOPLE_ERROR:
			return boxOfficePeopleHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
