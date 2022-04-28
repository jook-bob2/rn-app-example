import React from 'react'
import { initialAsyncState } from '../utils/initialAsyncState'
import { useContext, useReducer } from 'react'
import { chargeQueueReducer } from '../reducer/chargeQueueReducer'
import { ChargeQueueContext } from '../create/chargeQueueCreate'

const initialReturnData = {
	...initialAsyncState,
	data: {
		chargeQueueId: null,
		stationId: null,
		userId: null,
		userEvId: null,
		stationChgboxMapId: null,
		nickname: '',
		carNum: '',
		userTypeCd: '',
		stationName: '',
		startDate: '',
		expireDate: '',
		remainSeconds: null,
	},
}

export const initialRegistrationData = {
	...initialAsyncState,
	data: {
		id: null,
		stationId: null,
		userId: null,
		userEvId: null,
		stationChgboxMapId: null,
		nickname: '',
		carNum: '',
		model: '',
		userTypeCd: '',
		peopleCnt: 0,
		waitingCnt: 0,
		stationName: '',
		remainSeconds: null,
	},
}

export const initialChargingData = {
	...initialAsyncState,
	data: {
		connectorPk: 0,
		transactionPk: 0,
		nickname: '',
		model: '',
		carNum: '',
		userTypeCd: '',
		stationName: '',
		chargeTime: '',
		amount: '',
		kw: '',
	},
}

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	// 대기열 반환 데이터
	returnData: initialReturnData,
	// 대기열 저장
	chargeQueueSave: initialAsyncState,
	// 대기열 접수 데이터
	chargeQueueRegistration: initialRegistrationData,
	// 충전중인 데이터
	chargingData: initialChargingData,
	// 예약하기(RETURN) / 예약중지(CANCELED) / 차밥주기(CHARGING) / 차밥그만주기(COMPLETE) 데이터
	sendSteve: initialAsyncState,
}

export function ChargeQueueApiProvider({ children }) {
	const [state, dispatch] = useReducer(chargeQueueReducer, initialState)

	return <ChargeQueueContext.Provider value={{ state, dispatch }}>{children}</ChargeQueueContext.Provider>
}

export function useChargeQueueContext() {
	const { state, dispatch } = useContext(ChargeQueueContext)
	if (!state) {
		throw new Error('Cannot find ChargeQueueState')
	}
	return { state, dispatch }
}
