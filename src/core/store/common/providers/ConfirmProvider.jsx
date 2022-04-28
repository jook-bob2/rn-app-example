import React, { useContext, useReducer } from 'react'
import { ConfirmStateContext } from '@store/common/create'
import { confirmInitialState } from '@store/common/initialState'
import { confirmReducer } from '@store/common/reducer'
import { constants } from '@store/common/constants'

const { SET_OPEN_CONFIRM, SET_CLOSE_CONFIRM } = constants

export function ConfirmProvider({ children }) {
	const [confirmState, confirmDispatch] = useReducer(confirmReducer, confirmInitialState)

	function openConfirm(payload) {
		if (typeof payload === 'object') {
			const { msg, title, onPress, cancelButtonName, confirmButtonName } = payload
			confirmDispatch({
				type: SET_OPEN_CONFIRM,
				title,
				msg,
				cancelButtonName,
				confirmButtonName,
				onPress,
			})
		}
	}

	function closeConfirm() {
		confirmDispatch({
			type: SET_CLOSE_CONFIRM,
		})
	}

	return (
		<ConfirmStateContext.Provider value={{ confirmState, confirmDispatch, openConfirm, closeConfirm }}>
			{children}
		</ConfirmStateContext.Provider>
	)
}

export function useConfirm() {
	const { confirmState, confirmDispatch, openConfirm, closeConfirm } = useContext(ConfirmStateContext)
	if (!confirmState) {
		throw new Error('Cannot find ConfirmState')
	}
	return { confirmState, confirmDispatch, $confirm: openConfirm, closeConfirm }
}
