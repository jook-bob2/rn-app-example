import React from 'react'
import { initialAsyncState } from '../utils/initialAsyncState'
import { useContext, useReducer } from 'react'
import { AlarmContext } from '../create/alarmCreate'
import { alarmReducer } from '../reducer/alarmReducer'

// UsersContext 에서 사용 할 기본 상태
const initialState = {
	alarmCheck: initialAsyncState,
	alarmSelected: initialAsyncState,
}

export function AlarmApiProvider({ children }) {
	const [state, dispatch] = useReducer(alarmReducer, initialState)

	return <AlarmContext.Provider value={{ state, dispatch }}>{children}</AlarmContext.Provider>
}

export function useAlarmContext() {
	const { state, dispatch } = useContext(AlarmContext)
	if (!state) {
		throw new Error('Cannot find AlarmState')
	}
	return { state, dispatch }
}
