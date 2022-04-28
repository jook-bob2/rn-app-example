import { paymentConstants } from '../costants/paymentConstants'
import {
	recentChargeListHandler,
	paymentDetailHandler,
	paymentListHandler,
	isUnpaidHandler,
} from '../create/paymentCreate'

// 위에서 만든 객체 / 유틸 함수들을 사용하여 리듀서 작성
export function paymentReducer(state, action) {
	switch (action.type) {
		case paymentConstants.GET_RECENT_CHARGE_LIST:
		case paymentConstants.GET_RECENT_CHARGE_LIST_SUCCESS:
		case paymentConstants.GET_RECENT_CHARGE_LIST_ERROR:
			return recentChargeListHandler(state, action)
		case paymentConstants.GET_PAYMENT_DETAIL:
		case paymentConstants.GET_PAYMENT_DETAIL_SUCCESS:
		case paymentConstants.GET_PAYMENT_DETAIL_ERROR:
			return paymentDetailHandler(state, action)
		case paymentConstants.GET_PAYMENT_LIST:
		case paymentConstants.GET_PAYMENT_LIST_SUCCESS:
		case paymentConstants.GET_PAYMENT_LIST_ERROR:
			return paymentListHandler(state, action)
		case paymentConstants.GET_IS_UNPAID:
		case paymentConstants.GET_IS_UNPAID_SUCCESS:
		case paymentConstants.GET_IS_UNPAID_ERROR:
			return isUnpaidHandler(state, action)
		default:
			throw new Error(`Unhanded action type: ${action.type}`)
	}
}
