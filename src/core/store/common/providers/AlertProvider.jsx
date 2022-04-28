import React, { useContext, useReducer } from 'react'
import { AlertStateContext } from '@store/common/create'
import { alertInitialState } from '@store/common/initialState'
import { alertReducer } from '@store/common/reducer'
import { constants } from '@store/common/constants'

const { SET_OPEN_ALERT, SET_CLOSE_ALERT } = constants

export function AlertProvider({ children }) {
	const [alertState, alertDispatch] = useReducer(alertReducer, alertInitialState)

	function openAlert(payload) {
		if (typeof payload === 'object') {
			const { msg, title, onPress } = payload
			alertDispatch({
				type: SET_OPEN_ALERT,
				title,
				msg,
				onPress,
			})
		} else if (typeof payload === 'string') {
			alertDispatch({
				type: SET_OPEN_ALERT,
				msg: payload,
			})
		}
	}

	function closeAlert() {
		alertDispatch({
			type: SET_CLOSE_ALERT,
		})
	}

	return (
		<AlertStateContext.Provider value={{ alertState, alertDispatch, openAlert, closeAlert }}>
			{children}
		</AlertStateContext.Provider>
	)
}

export function useAlert() {
	const { alertState, alertDispatch, openAlert, closeAlert } = useContext(AlertStateContext)
	if (!alertState) {
		throw new Error('Cannot find AlertState')
	}
	return { alertState, alertDispatch, $alert: openAlert, closeAlert }
}
