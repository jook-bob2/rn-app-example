import React from 'react'
import { initialListState, initialAsyncState, initialResponse } from '../utils/initialAsyncState'
import { useContext, useReducer } from 'react'
import { paymentReducer } from '../reducer/paymentReducer'
import { PaymentContext } from '../create/paymentCreate'

export const paymentDetailInitialState = {
	...initialAsyncState,
	data: {
		...initialResponse,
		data: {
			paymentId: 0,
			stationName: '',
			addr1: '',
			addr2: '',
			userTypeCd: '',
			model: '',
			nickname: '',
			carNum: '',
			chargerNum: '',
			chargerType: '',
			chargeSpeed: '',
			electricalEnergy: '',
			chargePrice: '',
			startTime: '',
			endTime: '',
			totalTime: '',
			amount: '',
			regDate: '',
		},
	},
}

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	recentChargeList: initialListState,
	paymentDetail: paymentDetailInitialState,
	paymentList: initialListState,
	isUnpaid: initialAsyncState,
}

export function PaymentApiProvider({ children }) {
	const [state, dispatch] = useReducer(paymentReducer, initialState)

	return <PaymentContext.Provider value={{ state, dispatch }}>{children}</PaymentContext.Provider>
}

export function usePaymentContext() {
	const { state, dispatch } = useContext(PaymentContext)
	if (!state) {
		throw new Error('Cannot find PaymentState')
	}
	return { state, dispatch }
}
