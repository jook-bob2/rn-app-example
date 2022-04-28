import { chargeQueueConstants } from '../costants/chargeQueueConstants'
import {
	chargeQueueRegistrationHandler,
	chargeQueueReturnHandler,
	chargeQueueSaveHandler,
	chargingDataHandler,
	sendSteveHandler,
} from '../create/chargeQueueCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function chargeQueueReducer(state, action) {
	switch (action.type) {
		case chargeQueueConstants.GET_CHARGE_QUEUE_RETURN:
		case chargeQueueConstants.GET_CHARGE_QUEUE_RETURN_SUCCESS:
		case chargeQueueConstants.GET_CHARGE_QUEUE_RETURN_ERROR:
			return chargeQueueReturnHandler(state, action)
		case chargeQueueConstants.POST_CHARGE_QUEUE_SAVE:
		case chargeQueueConstants.POST_CHARGE_QUEUE_SAVE_SUCCESS:
		case chargeQueueConstants.POST_CHARGE_QUEUE_SAVE_ERROR:
			return chargeQueueSaveHandler(state, action)
		case chargeQueueConstants.GET_CHARGE_QUEUE_REGISTRATION:
		case chargeQueueConstants.GET_CHARGE_QUEUE_REGISTRATION_SUCCESS:
		case chargeQueueConstants.GET_CHARGE_QUEUE_REGISTRATION_ERROR:
			return chargeQueueRegistrationHandler(state, action)
		case chargeQueueConstants.GET_CHARGING_DATA:
		case chargeQueueConstants.GET_CHARGING_DATA_SUCCESS:
		case chargeQueueConstants.GET_CHARGING_DATA_ERROR:
			return chargingDataHandler(state, action)
		case chargeQueueConstants.PATCH_SEND_STEVE:
		case chargeQueueConstants.PATCH_SEND_STEVE_SUCCESS:
		case chargeQueueConstants.PATCH_SEND_STEVE_ERROR:
			return sendSteveHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
