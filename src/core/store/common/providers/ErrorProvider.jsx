import React, { useContext, useReducer } from 'react'
import { ErrorStateContext } from '@store/common/create'
import { errorInitialState } from '@store/common/initialState'
import { errorReducer } from '@store/common/reducer'
import { constants } from '@store/common/constants'

const { SET_OPEN_ERROR, SET_CLOSE_ERROR } = constants

export function ErrorProvider({ children }) {
	const [errorState, errorDispatch] = useReducer(errorReducer, errorInitialState)

	function openError(payload) {
		if (typeof payload === 'object') {
			const { msg, code, onPress } = payload
			errorDispatch({
				type: SET_OPEN_ERROR,
				code,
				msg,
				onPress,
			})
		} else if (typeof payload === 'string') {
			errorDispatch({
				type: SET_OPEN_ERROR,
				msg: payload,
			})
		}
	}

	function closeError() {
		errorDispatch({
			type: SET_CLOSE_ERROR,
		})
	}

	return (
		<ErrorStateContext.Provider value={{ errorState, errorDispatch, openError, closeError }}>
			{children}
		</ErrorStateContext.Provider>
	)
}

export function useError() {
	const { errorState, errorDispatch, openError, closeError } = useContext(ErrorStateContext)
	if (!errorState) {
		throw new Error('Cannot find errorState')
	}
	return { errorState, errorDispatch, $error: openError, closeError }
}
