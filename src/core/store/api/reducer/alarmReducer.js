import { alarmConstants } from '../costants/alarmConstants'
import { alarmCheckHandler, alarmSelectedHandler } from '../create/alarmCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function alarmReducer(state, action) {
	switch (action.type) {
		case alarmConstants.GET_ALARM_CHECK:
		case alarmConstants.GET_ALARM_CHECK_SUCCESS:
		case alarmConstants.GET_ALARM_CHECK_ERROR:
			return alarmCheckHandler(state, action)
		case alarmConstants.PUT_ALARM_SELECTED:
		case alarmConstants.PUT_ALARM_SELECTED_SUCCESS:
		case alarmConstants.PUT_ALARM_SELECTED_ERROR:
			return alarmSelectedHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
