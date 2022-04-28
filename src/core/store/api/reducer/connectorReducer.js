import { connectorConstants } from '../costants/connectorConstants'
import { connectorStatusHandler, statusAvailableHandler } from '../create/connectorCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function connectorReducer(state, action) {
	switch (action.type) {
		case connectorConstants.GET_CONNECTOR_STATUS:
		case connectorConstants.GET_CONNECTOR_STATUS_SUCCESS:
		case connectorConstants.GET_CONNECTOR_STATUS_ERROR:
			return connectorStatusHandler(state, action)
		case connectorConstants.GET_STATUS_AVAILABLE:
		case connectorConstants.GET_STATUS_AVAILABLE_SUCCESS:
		case connectorConstants.GET_STATUS_AVAILABLE_ERROR:
			return statusAvailableHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
